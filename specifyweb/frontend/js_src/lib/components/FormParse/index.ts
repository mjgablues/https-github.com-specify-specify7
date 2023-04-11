/**
 * Converts XML form and formTable definitions to JSON, while also
 * adding type safety and strictness to help resolve ambiguities
 */

import type { LocalizedString } from 'typesafe-i18n';

import { ajax } from '../../utils/ajax';
import { Http } from '../../utils/ajax/definitions';
import { f } from '../../utils/functools';
import type { IR, R, RA } from '../../utils/types';
import { defined, filterArray } from '../../utils/types';
import { parseXml } from '../AppResources/codeMirrorLinters';
import { formatDisjunction } from '../Atoms/Internationalization';
import { parseJavaClassName } from '../DataModel/resource';
import type { SpecifyTable } from '../DataModel/specifyTable';
import { getTable, strictGetTable } from '../DataModel/tables';
import { error } from '../Errors/assert';
import type { LogMessage } from '../Errors/interceptLogs';
import { consoleLog } from '../Errors/interceptLogs';
import {
  addContext,
  getLogContext,
  pushContext,
  setLogContext,
} from '../Errors/logContext';
import { cachableUrl } from '../InitialContext';
import { getPref } from '../InitialContext/remotePrefs';
import { formatUrl } from '../Router/queryString';
import type { SimpleXmlNode } from '../Syncer/xmlToJson';
import { toSimpleXmlNode, xmlToJson } from '../Syncer/xmlToJson';
import { getParsedAttribute } from '../Syncer/xmlUtils';
import type { FormCellDefinition } from './cells';
import { parseFormCell, processColumnDefinition } from './cells';
import { postProcessFormDef } from './postProcessFormDef';
import { webOnlyViews } from './webOnlyViews';

export type ViewDescription = ParsedFormDefinition & {
  readonly formType: FormType;
  readonly mode: FormMode;
  readonly table: SpecifyTable;
  readonly errors?: RA<LogMessage>;
  readonly viewSetId?: number;
  readonly name: string;
};

type AltView = {
  readonly default?: 'false' | 'true';
  readonly mode: FormMode;
  readonly name: string;
  readonly viewdef: string;
};

export type ViewDefinition = {
  readonly altviews: IR<AltView>;
  readonly busrules: string;
  readonly class: string;
  readonly name: string;
  readonly resourcelabels: 'false' | 'true';
  readonly viewdefs: IR<string>;
  readonly viewsetLevel: string;
  readonly viewsetName: string;
  readonly viewsetSource: string;
  readonly viewsetId: number | null;
};

export const formTypes = ['form', 'formTable'] as const;
export type FormType = typeof formTypes[number];
export type FormMode = 'edit' | 'search' | 'view';

const views: R<ViewDefinition | undefined> = {};

export const getViewSetApiUrl = (viewName:string): string =>
  formatUrl('/context/view.json', {
    viewName,
    // Don't spam the console with errors needlessly
    quiet:
      viewName in webOnlyViews() || getTable(viewName)?.isSystem === true
        ? ''
        : undefined,
  })

export const fetchView = async (
  name: string
): Promise<ViewDefinition | undefined> =>
  name in views
    ? Promise.resolve(views[name])
    : ajax(
        /*
         * NOTE: If getView hasn't yet been invoked, the view URL won't be
         * marked as cachable
         */
        cachableUrl(
          getViewSetApiUrl(name)
        ),
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { Accept: 'text/plain' },
        },
        {
          expectedResponseCodes: [Http.OK, Http.NOT_FOUND, Http.NO_CONTENT],
        }
      ).then(({ data, status }) => {
        // FEATURE: add an easy way to cache ajax responses:
        views[name] =
          status === Http.NOT_FOUND || status === Http.NO_CONTENT
            ? undefined
            : (JSON.parse(data) as ViewDefinition);
        if (status === Http.NOT_FOUND)
          console.error(
            `Unable to find a view definition for the "${name}" view`
          );
        return views[name];
      });

export function parseViewDefinition(
  view: ViewDefinition,
  defaultType: FormType,
  originalMode: FormMode,
  currentTable: SpecifyTable
): ViewDescription | undefined {
  const logContext = getLogContext();
  addContext({ view, defaultType, originalMode });

  const resolved = resolveViewDefinition(view, defaultType, originalMode);
  if (resolved === undefined) return undefined;
  addContext({ resolved });
  const { mode, formType, viewDefinition, table = currentTable } = resolved;

  const parser =
    formType === 'formTable' ? parseFormTableDefinition : parseFormDefinition;

  const logIndexBefore = consoleLog.length;
  const parsed = parser(viewDefinition, table);
  const errors = consoleLog.slice(logIndexBefore);
  setLogContext(logContext);

  return {
    mode,
    formType,
    table,
    viewSetId: view.viewsetId ?? undefined,
    errors,
    name: view.name,
    ...parsed,
  };
}

export function resolveViewDefinition(
  view: ViewDefinition,
  formType: FormType,
  mode: FormMode
):
  | {
      readonly viewDefinition: SimpleXmlNode;
      readonly formType: FormType;
      readonly mode: FormMode;
      readonly table: SpecifyTable | undefined;
    }
  | undefined {
  const viewDefinitions = parseViewDefinitions(view.viewdefs);
  if (Object.keys(viewDefinitions).length === 0) {
    console.error(`No view definitions found for the ${view.name} view`);
    return undefined;
  }

  const { altView, viewDefinition } = resolveAltView(
    view.altviews,
    viewDefinitions,
    formType,
    mode
  );

  const definition = viewDefinition.children.definition?.at(0)?.text;
  const actualViewDefinition =
    typeof definition === 'string'
      ? toSimpleXmlNode(xmlToJson(viewDefinitions[definition]))
      : viewDefinition;

  if (actualViewDefinition === undefined) return undefined;
  const actualDefinition = actualViewDefinition;

  const newFormType = getParsedAttribute(viewDefinition, 'type');
  const className = getParsedAttribute(actualDefinition, 'class');
  const tableName = f.maybe(className, parseJavaClassName);
  const resolvedFormType =
    formType === 'formTable'
      ? 'formTable'
      : formTypes.find(
          (type) => type.toLowerCase() === newFormType?.toLowerCase()
        ) ?? 'form';
  if (resolvedFormType === undefined)
    console.warn(
      `Unknown form type ${
        newFormType ?? '(null)'
      }. Expected one of ${formatDisjunction(formTypes)}`
    );

  return {
    viewDefinition: actualDefinition,
    formType: resolvedFormType ?? 'form',
    mode: mode === 'search' ? mode : altView.mode,
    table:
      tableName === undefined
        ? undefined
        : strictGetTable(
            tableName === 'ObjectAttachmentIFace' ? 'Attachment' : tableName
          ),
  };
}

const parseViewDefinitions = (
  viewDefinitions: ViewDefinition['viewdefs']
): IR<Element> =>
  Object.fromEntries(
    Object.entries(viewDefinitions).map(([name, xml]) => {
      const parsed = parseXml(xml);
      if (typeof parsed === 'string')
        error(`Failed parsing XML for view definition`, {
          error: parsed,
          xml,
        });
      return [
        name,
        parsed.tagName.toLowerCase() === 'viewdef'
          ? parsed
          : defined(
              parsed.querySelector('viewdef') ?? undefined,
              `Unable to find a <viewdef> tag for a ${name} view definition`
            ),
      ];
    })
  );

function resolveAltView(
  rawAltViews: ViewDefinition['altviews'],
  viewDefinitions: IR<Element>,
  formType: FormType,
  mode: FormMode
): {
  readonly altView: ViewDefinition['altviews'][number];
  readonly viewDefinition: SimpleXmlNode;
} {
  let altViews: RA<AltView> = Object.values(rawAltViews).filter(
    (altView) => altView.mode === mode
  );
  if (altViews.length === 0) altViews = Object.values(rawAltViews);

  let viewDefinition: Element | undefined = undefined;
  let altView = altViews.find((altView) => {
    viewDefinition = viewDefinitions[altView.viewdef];
    return (
      viewDefinition?.getAttribute('type')?.toLowerCase() ===
      formType.toLowerCase()
    );
  });
  if (altView === undefined || viewDefinition === undefined) {
    altView = altViews[0];
    viewDefinition = viewDefinitions[altView.viewdef];
  }
  return {
    altView,
    viewDefinition: toSimpleXmlNode(xmlToJson(viewDefinition)),
  };
}

export type ParsedFormDefinition = {
  // Define column sizes: either a number of pixels, or undefined for auto sizing
  readonly columns: RA<number | undefined>;
  // A two-dimensional grid of cells
  readonly rows: RA<RA<FormCellDefinition>>;
};

function parseFormTableDefinition(
  viewDefinition: SimpleXmlNode,
  table: SpecifyTable
): ParsedFormDefinition {
  const { rows } = parseFormDefinition(viewDefinition, table);
  const labelsForCells = Object.fromEntries(
    filterArray(
      rows
        .flat()
        .map((cell) =>
          cell.type === 'Label' && typeof cell.labelForCellId === 'string'
            ? [cell.labelForCellId, cell]
            : undefined
        )
    )
  );
  const row = rows
    .flat()
    // FormTable consists of Fields and SubViews only
    /*
     * FEATURE: extract fields from panels too
     */
    .filter(({ type }) => type === 'Field' || type === 'SubView')
    .map<FormCellDefinition>((cell) => ({
      ...cell,
      // Center all fields in each column
      align: 'center' as const,
      // Make sure SubViews are rendered as buttons
      ...(cell.type === 'SubView' ? { isButton: true } : {}),
      // Set ariaLabel for all cells (would be used in formTable headers)
      ariaLabel:
        cell.ariaLabel ??
        (cell.type === 'Field' && cell.fieldDefinition.type === 'Checkbox'
          ? cell.fieldDefinition.label
          : undefined) ??
        labelsForCells[cell.id ?? '']?.text ??
        (cell.type === 'Field' || cell.type === 'SubView'
          ? table?.getField(cell.fieldNames?.join('.') ?? '')?.label ??
            (cell.fieldNames?.join('.') as LocalizedString)
          : undefined),
      // Remove labels from checkboxes (as labels would be in the table header)
      ...(cell.type === 'Field' && cell.fieldDefinition.type === 'Checkbox'
        ? { fieldDefinition: { ...cell.fieldDefinition, label: undefined } }
        : {}),
    }));

  return {
    columns: parseFormTableColumns(viewDefinition, row),
    rows: [row],
  };
}

function parseFormTableColumns(
  viewDefinition: SimpleXmlNode,
  row: RA<FormCellDefinition>
): RA<number | undefined> {
  const columnCount = f.sum(row.map(({ colSpan }) => colSpan));
  const rawColumnDefinition = f.maybe(
    getColumnDefinition(viewDefinition, 'table'),
    processColumnDefinition
  );
  return [
    ...(rawColumnDefinition ?? []),
    ...Array.from({
      length: columnCount - (rawColumnDefinition ?? []).length,
    }).fill(undefined),
  ];
}

export function parseFormDefinition(
  viewDefinition: SimpleXmlNode,
  table: SpecifyTable
): ParsedFormDefinition {
  const context = getLogContext();
  const rowsContainer = viewDefinition?.children?.rows.at(0);
  const rows = rowsContainer?.children?.row ?? [];
  const data = postProcessFormDef(
    processColumnDefinition(getColumnDefinitions(viewDefinition)),
    rows.map((row, index) => {
      const context = getLogContext();
      pushContext({
        type: 'Child',
        tagName: 'row',
        extras: { row: index + 1 },
      });

      const data = row.children.cell?.map((cell, index) => {
        const context = getLogContext();
        pushContext({
          type: 'Child',
          tagName: 'cell',
          extras: { row: index + 1 },
        });

        const data = parseFormCell(table, cell);

        setLogContext(context);
        return data;
      });
      setLogContext(context);
      return data ?? [];
    }),
    table
  );
  setLogContext(context);
  return data;
}

function getColumnDefinitions(viewDefinition: SimpleXmlNode): string {
  const definition =
    getColumnDefinition(
      viewDefinition,
      getPref('form.definition.columnSource')
    ) ?? getColumnDefinition(viewDefinition, undefined);
  const resolved = definition ?? getParsedAttribute(viewDefinition, 'colDef');
  if (resolved === undefined)
    console.warn('Form definition does not contain column definition');
  return resolved ?? '';
}

const getColumnDefinition = (
  viewDefinition: SimpleXmlNode,
  os: string | undefined
): string | undefined =>
  viewDefinition.children.columnDef?.find((child) =>
    typeof os === 'string' ? getParsedAttribute(child, 'os') === os : true
  )?.text;

export const exportsForTests = {
  views,
  parseViewDefinitions,
  resolveAltView,
  parseFormTableDefinition,
  parseFormTableColumns,
  getColumnDefinitions,
  getColumnDefinition,
};
