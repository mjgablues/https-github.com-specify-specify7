import { requireContext } from '../../../tests/helpers';
import { theories } from '../../../tests/utils';
import type { PartialBy, ValueOf } from '../../../utils/types';
import { localized } from '../../../utils/types';
import { strictParseXml } from '../../AppResources/codeMirrorLinters';
import type { LiteralField } from '../../DataModel/specifyField';
import { tables } from '../../DataModel/tables';
import type { SimpleXmlNode } from '../../Syncer/xmlToJson';
import { toSimpleXmlNode, xmlToJson } from '../../Syncer/xmlToJson';
import type { CellTypes, FormCellDefinition } from '../cells';
import { parseFormCell, processColumnDefinition } from '../cells';

requireContext();

theories(processColumnDefinition, [
  {
    in: ['100px,2px,195px,5px,86px,2px,210px,5px,74px,2px,146px,15px,p:g'],
    out: [100, 195, 86, 210, 74, 146],
  },
  {
    in: [
      'p,2px,min(p;150px),5px:g,p,2px,p:g(2),5px:g,p,2px,p:g(2),5px:g,p,2px,p:g(2)',
    ],
    out: [
      undefined,
      150,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  },
  {
    in: ['p,2px,p:g,5px:g,p,2px,p:g(2),5px:g,p,2px,p:g(2)'],
    out: [undefined, undefined, undefined, undefined, undefined, undefined],
  },
  { in: ['130px,2px,705px,25px,95px,0px,p:g'], out: [130, 705, 95] },
  { in: ['p,2px,p:g(4),p:g,p,0px'], out: [undefined, undefined, undefined] },
]);

const cell = (
  cell: PartialBy<
    FormCellDefinition,
    'align' | 'ariaLabel' | 'colSpan' | 'id' | 'verticalAlign' | 'visible'
  > &
    ValueOf<CellTypes>
): FormCellDefinition => ({
  id: undefined,
  colSpan: 1,
  align: 'left',
  visible: true,
  ariaLabel: undefined,
  verticalAlign: 'stretch',
  ...cell,
});

const xml = (xml: string): SimpleXmlNode =>
  toSimpleXmlNode(xmlToJson(strictParseXml(xml)));

describe('parseFormCell', () => {
  test('base case', () => {
    jest.spyOn(console, 'warn').mockImplementation();
    expect(parseFormCell(tables.CollectionObject, xml('<cell />'))).toEqual(
      cell({
        type: 'Unsupported',
        cellType: undefined,
        verticalAlign: 'center',
        isBold: false,
      })
    );
  });

  test('unsupported cell with some attributes', () => {
    jest.spyOn(console, 'warn').mockImplementation();
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell invisible="true" type=" test2 " initialize="align=Center; verticalAlign=center" colSpan=" 5 " id="test"/>'
        )
      )
    ).toEqual(
      cell({
        id: 'test',
        colSpan: 3,
        align: 'center',
        // Cannot make "Unsupported" cell invisible
        visible: true,
        type: 'Unsupported',
        cellType: ' test2 ',
        verticalAlign: 'center',
        isBold: false,
      })
    );
  });

  test('invisible field', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type=" field " uiType="text" invisible="true" name="CatalogNumber" isRequired="TRuE " initialize="align=RIGHT" colSpan=" 5 " id="test" />'
        )
      )
    ).toEqual(
      cell({
        id: 'test',
        colSpan: 3,
        align: 'right',
        verticalAlign: 'center',
        visible: false,
        type: 'Field',
        fieldNames: ['catalogNumber'],
        isRequired: true,
        fieldDefinition: {
          defaultValue: undefined,
          isReadOnly: false,
          max: undefined,
          min: undefined,
          step: undefined,
          type: 'Text',
          maxLength: undefined,
          minLength: undefined,
          isBold: false,
        },
        isBold: false,
      })
    ));

  test('field required by schema', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="field" uiType="text" name="  CollectionObject.CollectionMemberId  " />'
        )
      )
    ).toEqual(
      cell({
        type: 'Field',
        isRequired: true,
        fieldNames: ['collectionMemberId'],
        verticalAlign: 'center',
        fieldDefinition: {
          defaultValue: undefined,
          isReadOnly: false,
          max: undefined,
          min: undefined,
          step: undefined,
          type: 'Text',
          maxLength: undefined,
          minLength: undefined,
          isBold: false,
        },
        isBold: false,
      })
    ));

  test('unknown field', () => {
    jest.spyOn(console, 'error').mockImplementation();
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="field" uiType="text" name="this" initialize="verticalAlign=end;"/>'
        )
      )
    ).toEqual(
      cell({
        type: 'Blank',
        verticalAlign: 'end',
        isBold: false,
      })
    );
  });

  test('unknown field with default value', () => {
    jest.spyOn(console, 'error').mockImplementation();
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml('<cell type="field" uiType="text" name="this" default="A" />')
      )
    ).toEqual(
      cell({
        type: 'Field',
        isRequired: false,
        fieldNames: undefined,
        verticalAlign: 'center',
        fieldDefinition: {
          defaultValue: 'A',
          isReadOnly: false,
          max: undefined,
          min: undefined,
          step: undefined,
          type: 'Text',
          maxLength: undefined,
          minLength: undefined,
          isBold: false,
        },
        isBold: false,
      })
    );
  });

  test('relationship field names are parsed correctly', () =>
    expect(
      parseFormCell(
        tables.Collector,
        xml('<cell type="field" uiType="text" name="agent.lastName" />')
      )
    ).toEqual(
      cell({
        type: 'Field',
        // The field is required by the data model
        isRequired: false,
        fieldNames: ['agent', 'lastName'],
        verticalAlign: 'center',
        fieldDefinition: {
          defaultValue: undefined,
          isReadOnly: false,
          max: undefined,
          min: undefined,
          step: undefined,
          type: 'Text',
          minLength: undefined,
          maxLength: undefined,
          isBold: false,
        },
        isBold: false,
      })
    ));

  test('fieldName overwritten by the PartialDateUI plugin', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="field" uiType="plugin" initialize="name=PartialDateUI;df=catalogedDate" />'
        )
      )
    ).toEqual(
      cell({
        type: 'Field',
        isRequired: false,
        fieldNames: ['catalogedDate'],
        verticalAlign: 'center',
        fieldDefinition: {
          type: 'Plugin',
          isReadOnly: false,
          pluginDefinition: {
            type: 'PartialDateUI',
            defaultValue: undefined,
            dateFields: ['catalogedDate'],
            canChangePrecision: true,
            precisionField: undefined,
            defaultPrecision: 'full',
          },
        },
        isBold: false,
      })
    ));

  test('simple label with custom text', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml('<cell type="Label" label="some text" />')
      )
    ).toEqual(
      cell({
        // Labels are right aligned by default
        align: 'right',
        verticalAlign: 'center',
        type: 'Label',
        text: localized('some text'),
        title: undefined,
        labelForCellId: undefined,
        fieldNames: undefined,
        isBold: false,
      })
    ));

  test('label with Specify 6 localization string', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="Label" label="FINDNEXT" labelfor=" 42" initialize="verticalAlign=center;"/>'
        )
      )
    ).toEqual(
      cell({
        align: 'right',
        verticalAlign: 'center',
        type: 'Label',
        text: localized('Find Next'),
        title: undefined,
        labelForCellId: '42',
        fieldNames: undefined,
        isBold: false,
      })
    ));

  test('Separator', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="separator"   label="FINDNEXT" name="unused" additional="unused" icon=" 42" forClass=" CollectionObject" />'
        )
      )
    ).toEqual(
      cell({
        type: 'Separator',
        label: localized('Find Next'),
        icon: '42',
        forClass: 'CollectionObject',
        verticalAlign: 'center',
        isBold: false,
      })
    ));

  test('basic SubView', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml('<cell type="subView" name="determinationS "  />')
      )
    ).toEqual(
      cell({
        type: 'SubView',
        formType: 'form',
        fieldNames: ['determinations'],
        viewName: undefined,
        isButton: false,
        isCollapsed: false,
        icon: undefined,
        sortField: undefined,
        isBold: false,
      })
    ));

  test('SubView button with custom icon and sorting', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="subView" name="determinations" defaultType="table" viewName="testView " initialize="sortField=-iscurrent ;btn=true  ; icon=test ; collapse=true" />'
        )
      )
    ).toEqual(
      cell({
        type: 'SubView',
        formType: 'formTable',
        fieldNames: ['determinations'],
        viewName: 'testView',
        isButton: true,
        isCollapsed: true,
        icon: 'test',
        sortField: { fieldNames: ['isCurrent'], direction: 'desc' },
        isBold: false,
      })
    ));

  test('Panel with conditional rendering', () =>
    expect(
      JSON.parse(
        JSON.stringify(
          parseFormCell(
            tables.CollectionObject,
            xml(
              `<cell type="panel" colDef="1px,2px,2px">
            <rows>
              <row>
                <cell type="Label" label="FINDNEXT" labelfor=" 42" />
              </row>
            </rows>
            <rows coldef="1px" condition="accession.accessionNumber=123">
            </rows>
            <rows condition="always">
            </rows>
          </cell>`
            )
          )
        )
      )
    ).toEqual(
      cell({
        type: 'Panel',
        align: 'left',
        verticalAlign: 'center',
        isBold: false,
        definitions: [
          {
            condition: undefined,
            definition: {
              columns: [1, 2],
              rows: [
                [
                  cell({
                    align: 'left',
                    labelForCellId: '42',
                    type: 'Label',
                    fieldNames: undefined,
                    text: localized('Find Next'),
                    title: undefined,
                    verticalAlign: 'center',
                    isBold: false,
                  }),
                  cell({
                    type: 'Blank',
                    visible: false,
                    isBold: false,
                  }),
                ],
              ],
            },
          },
          {
            condition: {
              type: 'Value',
              field: [
                '[relationship CollectionObject.accession]' as unknown as LiteralField,
                '[literalField Accession.accessionNumber]' as unknown as LiteralField,
              ],
              value: '123',
            },
            definition: {
              columns: [1],
              rows: [],
            },
          },
          {
            condition: {
              type: 'Always',
            },
            definition: {
              columns: [1, 2],
              rows: [],
            },
          },
        ],
        display: 'block',
      })
    ));

  test('inline Panel', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="panel" colDef="p:g,2px,2px" panelType="buttonBar"><rows /></cell>'
        )
      )
    ).toEqual(
      cell({
        type: 'Panel',
        definitions: [
          {
            condition: undefined,
            definition: {
              columns: [undefined, 2],
              rows: [],
            },
          },
        ],
        display: 'inline',
        verticalAlign: 'center',
        isBold: false,
      })
    ));

  test('Command', () =>
    expect(
      parseFormCell(
        tables.Loan,
        xml(
          '<cell type="command" name="ReturnLoan" label="generateLabelBtn" />'
        )
      )
    ).toEqual(
      cell({
        type: 'Command',
        commandDefinition: {
          commandDefinition: {
            type: 'ReturnLoan',
          },
          label: localized('generateLabelBtn'),
        },
        verticalAlign: 'center',
        isBold: false,
      })
    ));

  test('Blank', () =>
    expect(
      parseFormCell(
        tables.CollectionObject,
        xml(
          '<cell type="blank" name="ignored" initialize="verticalAlign=start;"/>'
        )
      )
    ).toEqual(cell({ type: 'Blank', verticalAlign: 'start', isBold: false })));
});
