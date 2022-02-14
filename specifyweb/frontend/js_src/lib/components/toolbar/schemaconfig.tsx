import React from 'react';

import { ajax } from '../../ajax';
import { fetchFormatters } from '../../dataobjformatters';
import commonText from '../../localization/common';
import { LANGUAGE } from '../../localization/utils';
import * as querystring from '../../querystring';
import { schema } from '../../schema';
import { formatAggregators } from '../../schemaconfighelper';
import type { JavaType, RelationshipType } from '../../specifyfield';
import type { IR, RA } from '../../types';
import { fetchContext as fetchUiFormatters } from '../../uiformatters';
import { getTableOverwrite } from '../../wbplanviewmodelfetcher';
import { webLinksDefs } from '../../weblinkbutton';
import { useAsyncState, useTitle, useUnloadProtect } from '../hooks';
import type { UserTool } from '../main';
import { LoadingScreen } from '../modaldialog';
import createBackboneView from '../reactbackboneextend';
import type {
  DataObjectFormatter,
  NewSpLocaleItemString,
  SpLocaleItemString,
  UiFormatter,
} from '../schemaconfig';
import { SchemaConfig } from '../schemaconfig';

type Props = {
  readonly onClose: () => void;
};

export type CommonTableFields = {
  readonly timestampcreated: string;
  readonly timestampmodified: string | null;
  readonly createdbyagent: string;
  readonly modifiedbyagent: string | null;
  readonly version: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly resource_uri: string;
};

export type SpLocaleContainer = CommonTableFields & {
  readonly id: number;
  readonly aggregator: string | null;
  // Readonly defaultui?: string;
  readonly format: string | null;
  readonly ishidden: boolean;
  readonly issystem: boolean;
  // Readonly isuiformatter: null;
  readonly name: string;
  readonly picklistname: string | null;
  /*
   * Readonly schematype: 0 | 1;
   * readonly items: string;
   */
  readonly descs: string;
  readonly names: string;
};

export type WithFetchedStrings = {
  readonly strings: {
    readonly desc: SpLocaleItemString | NewSpLocaleItemString;
    readonly name: SpLocaleItemString | NewSpLocaleItemString;
  };
};

export type WithTableInfo = {
  readonly dataModel: {
    readonly pickLists: IR<{
      readonly name: string;
      readonly isSystem: boolean;
    }>;
  };
};

export type WithFieldInfo = {
  readonly dataModel: {
    readonly length: number | undefined;
    readonly readOnly: boolean;
    readonly relatedModelName: string | undefined;
    readonly isRequired: boolean;
    readonly isRelationship: boolean;
    readonly type: JavaType | RelationshipType;
    readonly canChangeIsRequired: boolean;
  };
};

function SchemaConfigWrapper({ onClose: handleClose }: Props): JSX.Element {
  const { language: defaultLanguage, table: defaultTable } =
    querystring.parse();

  useTitle(commonText('schemaConfig'));

  const [languages] = useAsyncState<IR<string>>(
    React.useCallback(
      async () =>
        ajax<
          RA<{
            readonly country: string | null;
            readonly language: string;
          }>
        >('/context/schema/language/', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { Accept: 'application/json' },
        })
          .then(({ data }) =>
            // Sometimes languages are duplicated. Need to make the list unique
            Array.from(
              new Set(
                data.map(
                  ({ country, language }) =>
                    `${language}${
                      country === null || country === '' ? '' : `_${country}`
                    }`
                )
              )
            )
          )
          .then((languages) =>
            // Get translated language names
            Object.fromEntries(
              languages.map(
                (language) =>
                  [
                    language,
                    new Intl.DisplayNames(LANGUAGE, { type: 'language' }).of(
                      language.replace('_', '-')
                    ),
                  ] as const
              )
            )
          ),
      []
    )
  );
  const [tables] = useAsyncState<IR<SpLocaleContainer>>(
    React.useCallback(async () => {
      const excludedTables = new Set(
        Object.entries(schema.models)
          .filter(
            ([tableName, { system }]) =>
              system || getTableOverwrite(tableName.toLowerCase()) === 'remove'
          )
          .map(([tableName]) => tableName.toLowerCase())
      );

      return ajax<{ readonly objects: RA<SpLocaleContainer> }>(
        '/api/specify/splocalecontainer/?limit=0&domainfilter=true&schematype=0',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { headers: { Accept: 'application/json' } }
      )
        .then(({ data: { objects } }) =>
          // Exclude system tables
          objects.filter(({ name }) => !excludedTables.has(name))
        )
        .then((tables) =>
          // Index by ID
          Object.fromEntries(tables.map((table) => [table.id, table]))
        );
    }, [])
  );

  const [formatters, setFormatters] = React.useState<
    IR<DataObjectFormatter> | undefined
  >(undefined);
  const [aggregators, setAggregators] = React.useState<
    IR<DataObjectFormatter> | undefined
  >(undefined);

  React.useEffect(() => {
    void fetchFormatters.then(({ formatters, aggregators }) => {
      if (destructorCalled) return undefined;
      setFormatters(formatAggregators(formatters));
      setAggregators(formatAggregators(aggregators));
      return undefined;
    });
    let destructorCalled = false;
    return (): void => {
      destructorCalled = true;
    };
  }, []);

  const [uiFormatters] = useAsyncState<RA<UiFormatter>>(
    React.useCallback(
      async () =>
        fetchUiFormatters.then((formatters) =>
          Object.entries(formatters)
            .map(([name, formatter]) => ({
              name,
              isSystem: formatter.isSystem,
              value: formatter.value(),
            }))
            .filter(({ value }) => value)
        ),
      []
    )
  );

  const setHasUnloadProtect = useUnloadProtect(
    false,
    commonText('unsavedSchemaUnloadProtect')
  );

  return typeof languages === 'undefined' ||
    typeof tables === 'undefined' ||
    typeof formatters === 'undefined' ||
    typeof aggregators === 'undefined' ||
    typeof uiFormatters === 'undefined' ? (
    <LoadingScreen />
  ) : (
    <SchemaConfig
      languages={languages}
      tables={tables}
      defaultLanguage={defaultLanguage}
      defaultTable={Object.values(tables).find(
        ({ name }) => name === defaultTable
      )}
      webLinks={Object.keys(webLinksDefs)}
      uiFormatters={uiFormatters}
      dataObjFormatters={formatters}
      dataObjAggregators={aggregators}
      onClose={handleClose}
      onSave={(language): void => {
        setHasUnloadProtect(false, () =>
          // Reload the page after schema changes
          window.location.assign(
            `/specify/task/schema-config/?language=${language}`
          )
        );
      }}
      removeUnloadProtect={(): void => setHasUnloadProtect(false)}
      setUnloadProtect={(): void => setHasUnloadProtect(true)}
    />
  );
}

const View = createBackboneView(SchemaConfigWrapper);

const userTool: UserTool = {
  task: 'schema-config',
  title: commonText('schemaConfig'),
  view: ({ onClose }) => new View({ onClose }),
};

export default userTool;
