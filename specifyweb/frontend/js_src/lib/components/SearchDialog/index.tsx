import React from 'react';
import type { LocalizedString } from 'typesafe-i18n';

import { useBooleanState } from '../../hooks/useBooleanState';
import { useId } from '../../hooks/useId';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import { queryText } from '../../localization/query';
import { f } from '../../utils/functools';
import type { RA, RR } from '../../utils/types';
import { sortFunction } from '../../utils/utils';
import { Ul } from '../Atoms';
import { Button } from '../Atoms/Button';
import { Form } from '../Atoms/Form';
import { Link } from '../Atoms/Link';
import { Submit } from '../Atoms/Submit';
import { SearchDialogContext } from '../Core/Contexts';
import type { AnySchema, CommonFields } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import { getResourceViewUrl } from '../DataModel/resource';
import type { SpecifyTable } from '../DataModel/specifyTable';
import type { SpQueryField, Tables } from '../DataModel/types';
import { error } from '../Errors/assert';
import { raise } from '../Errors/Crash';
import { format } from '../Formatters/formatters';
import { SpecifyForm } from '../Forms/SpecifyForm';
import { useViewDefinition } from '../Forms/useViewDefinition';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { ProtectedAction } from '../Permissions/PermissionDenied';
import { userPreferences } from '../Preferences/userPreferences';
import { createQuery } from '../QueryBuilder';
import type { QueryFieldFilter } from '../QueryBuilder/FieldFilter';
import { queryFieldFilters } from '../QueryBuilder/FieldFilter';
import { QueryFieldSpec } from '../QueryBuilder/fieldSpec';
import { QueryBuilder } from '../QueryBuilder/Wrapped';
import { queryCbxExtendedSearch } from './helpers';

const resourceLimit = 100;

export type QueryComboBoxFilter<SCHEMA extends AnySchema> = {
  readonly field: string & (keyof CommonFields | keyof SCHEMA['fields']);
  readonly isNot: boolean;
  readonly operation: QueryFieldFilter & ('between' | 'in' | 'less');
  readonly value: string;
};

const viewNameExceptions: Partial<RR<keyof Tables, string>> = {
  GeologicTimePeriod: 'ChronosStratSearch',
};

/**
 * Display a resource search dialog
 */
export function SearchDialog<SCHEMA extends AnySchema>(props: {
  readonly forceCollection: number | undefined;
  readonly extraFilters: RA<QueryComboBoxFilter<SCHEMA>> | undefined;
  readonly table: SpecifyTable<SCHEMA>;
  readonly multiple: boolean;
  readonly onClose: () => void;
  readonly searchView?: string;
  readonly onSelected: (resources: RA<SpecifyResource<SCHEMA>>) => void;
}): JSX.Element | null {
  const [alwaysUseQueryBuilder] = userPreferences.use(
    'form',
    'queryComboBox',
    'alwaysUseQueryBuilder'
  );
  const [useQueryBuilder, handleUseQueryBuilder] = useBooleanState(
    alwaysUseQueryBuilder
  );
  return useQueryBuilder ? (
    <QueryBuilderSearch
      // BUG: pass on extraFilters
      {...props}
      onSelected={(records): void => {
        props.onSelected(records);
        props.onClose();
      }}
    />
  ) : (
    <SearchForm {...props} onUseQueryBuilder={handleUseQueryBuilder} />
  );
}

const filterResults = <SCHEMA extends AnySchema>(
  results: RA<SpecifyResource<SCHEMA>>,
  extraFilters: RA<QueryComboBoxFilter<SCHEMA>>
): RA<SpecifyResource<SCHEMA>> =>
  results.filter((result) =>
    extraFilters.every((filter) => testFilter(result, filter))
  );

function testFilter<SCHEMA extends AnySchema>(
  resource: SpecifyResource<SCHEMA>,
  { operation, field, value, isNot }: QueryComboBoxFilter<SCHEMA>
): boolean {
  const values = value.split(',').map(f.trim);
  const result =
    operation === 'between'
      ? (resource.get(field) ?? 0) >= values[0] &&
        (resource.get(field) ?? 0) <= values[1]
      : operation === 'in'
      ? // Cast numbers to strings
        // eslint-disable-next-line eqeqeq
        values.some((value) => value == resource.get(field))
      : operation === 'less'
      ? values.every((value) => (resource.get(field) ?? 0) < value)
      : error('Invalid Query Combo Box search filter', {
          filter: {
            operation,
            field,
            values,
          },
          resource,
        });
  return isNot ? !result : result;
}

function SearchForm<SCHEMA extends AnySchema>({
  forceCollection,
  extraFilters = emptyArray,
  table,
  searchView,
  onSelected: handleSelected,
  onClose: handleClose,
  onUseQueryBuilder: handleUseQueryBuilder,
}: {
  readonly forceCollection: number | undefined;
  readonly extraFilters: RA<QueryComboBoxFilter<SCHEMA>> | undefined;
  readonly table: SpecifyTable<SCHEMA>;
  readonly searchView?: string;
  readonly onClose: () => void;
  readonly onSelected: (resources: RA<SpecifyResource<SCHEMA>>) => void;
  readonly onUseQueryBuilder: () => void;
}): JSX.Element | null {
  const templateResource = React.useMemo(
    () =>
      new table.Resource(
        {},
        {
          noBusinessRules: true,
        }
      ),
    [table]
  );
  const viewName = viewNameExceptions[table.name] ?? `${table.name}Search`;

  const resolvedName = searchView ?? viewName;
  const viewDefinition = useViewDefinition({
    table,
    viewName: resolvedName,
    fallbackViewName: resolvedName === viewName ? table.view : viewName,
    formType: 'form',
    mode: 'search',
  });

  const [isLoading, handleLoading, handleLoaded] = useBooleanState();
  const [results, setResults] = React.useState<
    | RA<{
        readonly id: number;
        readonly formatted: LocalizedString;
        readonly resource: SpecifyResource<SCHEMA>;
      }>
    | undefined
  >(undefined);
  const id = useId('search-dialog');

  return (
    <Dialog
      buttons={
        <>
          <Button.DialogClose>{commonText.cancel()}</Button.DialogClose>
          <ProtectedAction action="execute" resource="/querybuilder/query">
            <Button.Info onClick={handleUseQueryBuilder}>
              {queryText.queryBuilder()}
            </Button.Info>
          </ProtectedAction>
          <Submit.Green form={id('form')}>{commonText.search()}</Submit.Green>
        </>
      }
      dimensionsKey={`SearchDialog-${table.name}`}
      header={commonText.search()}
      modal={false}
      onClose={handleClose}
    >
      <Form
        id={id('form')}
        onSubmit={(): void => {
          handleLoading();
          queryCbxExtendedSearch(templateResource, forceCollection)
            .then(async (resources) =>
              Promise.all(
                filterResults(resources, extraFilters).map(
                  async (resource) => ({
                    id: resource.id,
                    formatted: await format(resource, undefined, true),
                    resource,
                  })
                )
              ).then((results) =>
                setResults(
                  Array.from(results).sort(
                    sortFunction(({ formatted }) => formatted)
                  )
                )
              )
            )
            .finally(handleLoaded)
            .catch(raise);
        }}
      >
        <SearchDialogContext.Provider value>
          <SpecifyForm
            display="inline"
            resource={templateResource}
            viewDefinition={viewDefinition}
          />
        </SearchDialogContext.Provider>
        <Ul
          className={`
            min-w-96 h-40 overflow-auto rounded
            border bg-white p-2 ring-1 ring-gray-500 dark:bg-neutral-700 dark:ring-0
          `}
        >
          {isLoading ? (
            <li>{commonText.loading()}</li>
          ) : results === undefined ? undefined : results.length === 0 ? (
            <li>{commonText.noResults()}</li>
          ) : (
            <>
              {results.map(({ id, formatted, resource }) => (
                <li key={id}>
                  <Link.Default
                    href={getResourceViewUrl(table.name, id)}
                    onClick={(event): void => {
                      event.preventDefault();
                      handleSelected([resource]);
                      handleClose();
                    }}
                  >
                    {formatted}
                  </Link.Default>
                </li>
              ))}
              {results.length === resourceLimit && (
                <li>
                  <span className="sr-only">
                    {formsText.additionalResultsOmitted()}
                  </span>
                  ...
                </li>
              )}
            </>
          )}
        </Ul>
      </Form>
    </Dialog>
  );
}

const emptyArray = [] as const;

function QueryBuilderSearch<SCHEMA extends AnySchema>({
  forceCollection,
  extraFilters = emptyArray,
  table,
  onSelected: handleSelected,
  onClose: handleClose,
  multiple,
}: {
  readonly forceCollection: number | undefined;
  readonly extraFilters: RA<QueryComboBoxFilter<SCHEMA>> | undefined;
  readonly table: SpecifyTable<SCHEMA>;
  readonly onClose: () => void;
  readonly onSelected: (resources: RA<SpecifyResource<SCHEMA>>) => void;
  readonly multiple: boolean;
}): JSX.Element {
  const query = React.useMemo(
    () =>
      createQuery(commonText.search(), table).set(
        'fields',
        toQueryFields(table, extraFilters)
      ),
    [table, extraFilters]
  );
  const [selected, setSelected] = React.useState<RA<number>>([]);
  return (
    <Dialog
      buttons={
        <>
          <Button.DialogClose>{commonText.close()}</Button.DialogClose>
          <Button.Info
            disabled={
              selected.length === 0 || (selected.length > 1 && !multiple)
            }
            onClick={(): void =>
              handleSelected(selected.map((id) => new table.Resource({ id })))
            }
          >
            {commonText.select()}
          </Button.Info>
        </>
      }
      className={{
        container: dialogClassNames.wideContainer,
      }}
      dimensionsKey="QueryBuilder"
      header={queryText.queryBuilder()}
      onClose={handleClose}
    >
      <QueryBuilder
        forceCollection={forceCollection}
        isEmbedded
        query={query}
        recordSet={undefined}
        onSelected={setSelected}
      />
    </Dialog>
  );
}

const toQueryFields = <SCHEMA extends AnySchema>(
  table: SpecifyTable<SCHEMA>,
  filters: RA<QueryComboBoxFilter<SCHEMA>>
): RA<SpecifyResource<SpQueryField>> =>
  filters.map(({ field, operation, isNot, value }) =>
    QueryFieldSpec.fromPath(table.name, [field])
      .toSpQueryField()
      .set('operStart', queryFieldFilters[operation].id)
      .set('isNot', isNot)
      .set('startValue', value)
  );