# Generated by Django 3.2.15 on 2023-12-28 22:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('specify', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='UniquenessRule',
            fields=[
                ('id', models.AutoField(db_column='uniquenessruleid', primary_key=True, serialize=False, verbose_name='uniquenessruleid')),
                ('isDatabaseConstraint', models.BooleanField(db_column='isDatabaseConstraint', default=False)),
                ('modelName', models.CharField(max_length=256)),
                ('discipline', models.ForeignKey(db_column='DisciplineID', on_delete=django.db.models.deletion.PROTECT, to='specify.discipline')),
            ],
            options={
                'db_table': 'uniquenessrule',
            },
        ),
        migrations.CreateModel(
            name='UniquenessRule_Field',
            fields=[
                ('uniquenessrule_fieldid', models.AutoField(primary_key=True, serialize=False, verbose_name='uniquenessrule_fieldsid')),
                ('fieldPath', models.TextField(blank=True, null=True)),
                ('isScope', models.BooleanField(default=False)),
                ('uniquenessrule', models.ForeignKey(db_column='uniquenessruleid', on_delete=django.db.models.deletion.CASCADE, to='businessrules.uniquenessrule')),
            ],
            options={
                'db_table': 'uniquenessrule_fields',
            },
        ),
    ]
