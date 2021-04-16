import { getMappingLineData } from '../wbplanviewnavigator';
import { loadDataModel, runTest } from './testmain';

export default function (): void {
  loadDataModel();

  runTest(
    'WbPlanViewNavigator.getMappingLineData',
    [
      [
        [
          {
            baseTableName: 'collectionobject',
            mappingPath: ['determinations', '#1', 'taxon', '$Family', 'name'],
            generateLastRelationshipData: true,
            customSelectType: 'OPENED_LIST',
            showHiddenFields: false,
          },
        ],
        JSON.stringify([
          {
            customSelectType: 'OPENED_LIST',
            customSelectSubtype: 'simple',
            selectLabel: 'Collection Object',
            fieldsData: {
              altcatalognumber: {
                fieldFriendlyName: 'Alt Cat Number',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              catalognumber: {
                fieldFriendlyName: 'Catalog Number',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              catalogeddate: {
                fieldFriendlyName: 'Cataloged Date',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              guid: {
                fieldFriendlyName: 'GUID',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              projectnumber: {
                fieldFriendlyName: 'Project Number',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              accession: {
                fieldFriendlyName: 'Accession',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: true,
                tableName: 'accession',
              },
              cataloger: {
                fieldFriendlyName: 'Cataloger',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: true,
                tableName: 'agent',
              },
              collectionobjectattribute: {
                fieldFriendlyName: 'Col Obj Attribute',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: true,
                tableName: 'collectionobjectattribute',
              },
              collectingevent: {
                fieldFriendlyName: 'Collecting Event',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: true,
                tableName: 'collectingevent',
              },
              determinations: {
                fieldFriendlyName: 'Determinations',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: true,
                isRelationship: true,
                tableName: 'determination',
              },
              preparations: {
                fieldFriendlyName: 'Preparations',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: true,
                tableName: 'preparation',
              },
            },
            tableName: 'collectionobject',
            isOpen: true,
          },
          {
            customSelectType: 'OPENED_LIST',
            customSelectSubtype: 'toMany',
            selectLabel: 'Determination',
            fieldsData: {
              '#1': {
                fieldFriendlyName: '#1',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: true,
                tableName: 'determination',
              },
              add: {
                fieldFriendlyName: 'Add',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'determination',
              },
            },
            tableName: 'determination',
            isOpen: true,
          },
          {
            customSelectType: 'OPENED_LIST',
            customSelectSubtype: 'simple',
            selectLabel: 'Determination',
            fieldsData: {
              iscurrent: {
                fieldFriendlyName: 'Current',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              determineddate: {
                fieldFriendlyName: 'Determined Date',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              guid: {
                fieldFriendlyName: 'GUID',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              typestatusname: {
                fieldFriendlyName: 'Type Status',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              determiner: {
                fieldFriendlyName: 'Determiner',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: true,
                tableName: 'agent',
              },
              taxon: {
                fieldFriendlyName: 'Taxon',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: true,
                isRelationship: true,
                tableName: 'taxon',
              },
            },
            tableName: 'determination',
            isOpen: true,
          },
          {
            customSelectType: 'OPENED_LIST',
            customSelectSubtype: 'tree',
            selectLabel: 'Taxon',
            fieldsData: {
              $Kingdom: {
                fieldFriendlyName: 'Kingdom',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Phylum: {
                fieldFriendlyName: 'Phylum',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Subphylum: {
                fieldFriendlyName: 'Subphylum',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Superclass: {
                fieldFriendlyName: 'Superclass',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Class: {
                fieldFriendlyName: 'Class',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Subclass: {
                fieldFriendlyName: 'Subclass',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Infraclass: {
                fieldFriendlyName: 'Infraclass',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Superorder: {
                fieldFriendlyName: 'Superorder',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Order: {
                fieldFriendlyName: 'Order',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Family: {
                fieldFriendlyName: 'Family',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: true,
                tableName: 'taxon',
              },
              $Subfamily: {
                fieldFriendlyName: 'Subfamily',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Genus: {
                fieldFriendlyName: 'Genus',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Subgenus: {
                fieldFriendlyName: 'Subgenus',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Species: {
                fieldFriendlyName: 'Species',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
              $Subspecies: {
                fieldFriendlyName: 'Subspecies',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isRelationship: true,
                isDefault: false,
                tableName: 'taxon',
              },
            },
            tableName: 'taxon',
            isOpen: true,
          },
          {
            customSelectType: 'OPENED_LIST',
            customSelectSubtype: 'simple',
            selectLabel: 'Taxon',
            fieldsData: {
              author: {
                fieldFriendlyName: 'Author',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              commonname: {
                fieldFriendlyName: 'Common Name',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              fullname: {
                fieldFriendlyName: 'Full Name',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              guid: {
                fieldFriendlyName: 'GUID',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
              name: {
                fieldFriendlyName: 'Name',
                isEnabled: true,
                isRequired: true,
                isHidden: false,
                isDefault: true,
                isRelationship: false,
              },
              source: {
                fieldFriendlyName: 'Source',
                isEnabled: true,
                isRequired: false,
                isHidden: false,
                isDefault: false,
                isRelationship: false,
              },
            },
            tableName: 'taxon',
            isOpen: true,
          },
        ]),
      ],
    ],
    (arguments_: Parameters<typeof getMappingLineData>[0]) =>
      JSON.stringify(getMappingLineData(arguments_))
  );
}
