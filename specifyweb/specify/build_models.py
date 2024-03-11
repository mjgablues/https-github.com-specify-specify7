import time
from attr import has
from django.db import models

from model_utils import FieldTracker
from requests import get

from specifyweb.businessrules.exceptions import AbortSave
from . import model_extras
from .model_timestamp import SpTimestampedModel

appname = __name__.split('.')[-2]

# REFACTOR: generate this on the fly based on presence of
#    ordinal/ordernumber/position etc field in a table. This way it will
#    automatically work for any newly added table
orderings = {
    'Picklistitem': ('ordinal', ),
    'Recordsetitem': ('recordid', ),
    'Spqueryfield': ('position', ),
    'Determination': ('-iscurrent',),
    'Author': ('ordernumber',),
    'Collector': ('ordernumber',),
    'AgentSpecialty': ('ordernumber',),
    'Determiner': ('ordernumber',),
    'Extractor': ('ordernumber',),
    'FieldNotebookPageSet': ('ordernumber',),
    'FundingAgent': ('ordernumber',),
    'GroupPerson': ('ordernumber',),
    'PcrPerson': ('ordernumber',),
}

def make_model(module, table, datamodel):
    """Returns a Django model class based on the
    definition of a Specify table.
    """
    attrs = dict(id = make_id_field(table.idColumn),
                 specify_model = table,
                 __module__ = module)

    for field in table.fields:
        fldname = field.name.lower()
        maker = field_type_map[field.type]
        fldargs = {}
        if fldname == 'timestampcreated':
            # fldargs['auto_now_add'] = True
            pass
        if fldname == 'timestampmodified':
            # fldargs['auto_now'] = True
            pass
        if fldname == 'version':
            fldargs['default'] = 0
        attrs[fldname] = maker(field, fldargs)

    for rel in table.relationships:
        relname = rel.name.lower()
        relationship = make_relationship(table.django_name, rel, datamodel)
        if relationship is not None:
            attrs[relname] = relationship

    class Meta:
        db_table = table.table
        ordering = tuple()
        if table.django_name in orderings:
            ordering += orderings[table.django_name]
        if 'rankid' in attrs:
            ordering += ('rankid', )

    def save(self, *args, **kwargs):
        try:
            return super(model, self).save(*args, **kwargs)
        except AbortSave:
            return

    # def save_timestamped(self, *args, **kwargs):
    #     timestamp_override = kwargs.pop('timestamp_override', False)

    #     # Normal behavior is to update the timestamps automatically when saving.
    #     # If timestampcreated or timestampmodified have been edited, don't update them to the current time.
    #     # Also, if timestamp_override is True, don't update the timestamps.
    #     if not timestamp_override and \
    #        'timestampcreated' not in self.tracker.changed() and \
    #        'timestampmodified' not in self.tracker.changed():
    #         if not self.id:
    #             self.timestampcreated = timezone.now()
            
    #         self.timestampmodified = timezone.now()
        
    #     if hasattr(self, 'timestampcreated') and getattr(self, 'timestampcreated') is None:
    #         self.timestampcreated = timezone.now()
    #     if hasattr(self, 'timestampmodified') and getattr(self, 'timestampmodified') is None:
    #         self.timestampmodified = timezone.now()

    #     super(model, self).save(*args, **kwargs)

    field_names = [field.name.lower() for field in table.fields]
    timestamp_fields = filter(lambda x: x in ['timestampcreated', 'timestampmodified'], field_names)
    has_timestampcreated = 'timestampcreated' in field_names
    has_timestampmodified = 'timestampmodified' in field_names
    has_timestamp_field = has_timestampcreated or has_timestampmodified
    if has_timestamp_field:
        tracked_fields = []
        if has_timestampcreated:
            tracked_fields.append('timestampcreated')
        if has_timestampmodified:
            tracked_fields.append('timestampmodified')
        attrs['tracker'] = FieldTracker(fields=tracked_fields)
    
    attrs['Meta'] = Meta
    if not has_timestamp_field:
        attrs['save'] = save

    # supercls = getattr(model_extras, table.django_name, models.Model) if not has_timestamp_field \
    #     else getattr(model_extras, table.django_name, SpTimestampedModel)
    
    supercls = models.Model
    is_in_model_extras = hasattr(model_extras, table.django_name)
    if is_in_model_extras:
        supercls = getattr(model_extras, table.django_name)
    elif has_timestamp_field:
        supercls = SpTimestampedModel
    model = type(table.django_name, (supercls,), attrs)

    return model

def make_id_field(column):
    return models.AutoField(primary_key=True, db_column=column.lower())

def protect(collector, field, sub_objs, using):
    if hasattr(collector, 'delete_blockers'):
        collector.delete_blockers.append((field, sub_objs))
    else:
        models.PROTECT(collector, field, sub_objs, using)

SPECIAL_DELETION_RULES = {
    'Agent.specifyuser': models.SET_NULL,
    'Recordsetitem.recordset': models.CASCADE,

    # Handle workbench deletion using raw sql in business rules.
    'Workbenchrow.workbench': models.DO_NOTHING,
    'Workbenchdataitem.workbenchrow': models.DO_NOTHING,
    'Workbenchrowimage.workbenchrow': models.DO_NOTHING,
    'Workbenchrowexportedrelationship.workbenchrow': models.DO_NOTHING,

    'Spappresourcedir.specifyuser': models.CASCADE,
    'Spappresource.specifyuser': models.CASCADE,
    'Spappresource.spappresourcedir': models.CASCADE,
    'Spappresourcedata.spappresource': models.CASCADE,
    'Spappresourcedata.spviewsetobj': models.CASCADE,
    'Spreport.appresource': models.CASCADE,
}

def make_relationship(modelname, rel, datamodel):
    """Return a Django relationship field for the given relationship definition.

    modelname - name of the model this field will be part of
    relname - name of the field
    rel - the relationship definition from the Specify datamodel
    """
    relatedmodel = rel.relatedModelName.capitalize()
    # Usergroupscope breaks things.
    # I think maybe it is a superclass thing and not really a table?
    # Ignore it for now.
    if relatedmodel == 'Usergroupscope':
        return models.IntegerField(db_column=rel.column, null=True)

    if rel.type == 'one-to-many':
        return None # only define the "to" side of the relationship
    if rel.type == 'many-to-many':
        # skip many-to-many fields for now.
        return None

    try:
        on_delete = SPECIAL_DELETION_RULES["%s.%s" % (modelname.capitalize(), rel.name.lower())]
    except KeyError:
        reverse = datamodel.reverse_relationship(rel)

        if reverse and reverse.dependent:
            on_delete = models.CASCADE
        else:
            on_delete = protect

    def make_to_one(Field):
        """Setup a field of the given 'Field' type which can be either
        ForeignKey (many-to-one) or OneToOneField.
        """
        if hasattr(rel, 'otherSideName'):
            related_name = rel.otherSideName.lower()
        else:
            related_name = '+' # magic symbol means don't make reverse field

        return Field('.'.join((appname, relatedmodel)),
                     db_column = rel.column,
                     related_name = related_name,
                     null = not rel.required,
                     on_delete = on_delete)

    if rel.type == 'many-to-one':
        return make_to_one(models.ForeignKey)

    if rel.type == 'one-to-one' and hasattr(rel, 'column'):
        return make_to_one(models.OneToOneField)

class make_field(object):
    """An abstract "psuedo" metaclass that produces instances of the
    appropriate Django model field type. Utilizes inheritance
    mechanism to factor out common aspects of Field configuration.
    """
    @classmethod
    def get_field_class(cls, fld):
        """Return the Django model field class to be used for
        the given field definition. Defaults to returning the
        'field_class' attribute of the class, but can be overridden
        in subclass for more specific behavior.
        """
        return cls.field_class

    @classmethod
    def make_args(cls, fld):
        """Return a dict of arguments for the field constructor
        based on the XML definition. These are common arguements
        used by most field types.
        """
        return dict(
            db_column = fld.column.lower(),
            db_index = fld.indexed,
            unique = fld.unique,
            null = not fld.required)

    def __new__(cls, fld, fldargs):
        """Override the instance constructor to return configured instances
        of the appropriant Django model field for given parameters.

        flddef - the XML node defining the field
        fldargs - custom arguments for the field. will override any defaults.
        """
        field_class = cls.get_field_class(fld)
        args = cls.make_args(fld)
        args.update(fldargs)
        return field_class(**args)

class make_string_field(make_field):
    """A specialization of make_field that handles string type data."""
    field_class = models.CharField

    @classmethod
    def make_args(cls, fld):
        """Supplement the standard field options with the 'length'
        and 'blank' options supported by the Django CharField type.
        """
        args = super(make_string_field, cls).make_args(fld)
        args.update(dict(
                max_length = fld.length,
                blank = not fld.required))
        return args

class make_text_field(make_field):
    """A specialization of make_field for Text fields."""
    field_class = models.TextField

class make_integer_field(make_field):
    """A specialization of make_field for Integer fields."""
    field_class = models.IntegerField

class make_date_field(make_field):
    """A specialization of make_field for Date fields."""
    field_class = models.DateField

class make_float_field(make_field):
    """A specialization of make_field for Floating point number fields."""
    field_class = models.FloatField

class make_datetime_field(make_field):
    """A specialization of make_field for timestamp fields."""
    field_class = models.DateTimeField

class make_decimal_field(make_field):
    """A specialization of make_field for Decimal fields."""
    field_class = models.DecimalField

    @classmethod
    def make_args(cls, fld):
        """Augment the standard field options with those specific
        to Decimal fields.
        """
        args = super(make_decimal_field, cls).make_args(fld)
        args.update(dict(
            # The precision info is not included in the
            # XML schema def. I don't think it really
            # matters what values are here since
            # the schema is already built.
            max_digits = 22,
            decimal_places = 10,
            blank = not fld.required))
        return args

class make_boolean_field(make_field):
    """A specialization of make_field for Boolean type fields."""
    field_class = models.BooleanField

    @classmethod
    def make_args(cls, fld):
        """Make False the default as it was in Django 1.5"""
        args = super(make_boolean_field, cls).make_args(fld)
        if fld.required:
            args['default'] = False
        return args

# Map the field types used in specify_datamodel.xml to the
# appropriate field constructor functions.
field_type_map = {
    'text': make_text_field,
    'java.lang.String': make_string_field,
    'java.lang.Integer': make_integer_field,
    'java.lang.Long': make_integer_field,
    'java.lang.Byte': make_integer_field,
    'java.lang.Short': make_integer_field,
    'java.util.Calendar': make_datetime_field,
    'java.util.Date': make_date_field,
    'java.lang.Float': make_float_field,
    'java.lang.Double': make_float_field,
    'java.sql.Timestamp': make_datetime_field,
    'java.math.BigDecimal': make_decimal_field,
    'java.lang.Boolean': make_boolean_field,
    }

def build_models(module, datamodel):
    return { model.specify_model.tableId: model
             for table in datamodel.tables
             for model in [ make_model(module, table, datamodel) ]}
