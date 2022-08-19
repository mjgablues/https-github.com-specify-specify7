import React from 'react';
import type { State } from 'typesafe-reducer';

import { ajax } from '../ajax';
import type { RecordSet, SpQuery, Tables } from '../datamodel';
import { serializeResource } from '../datamodelutils';
import { f } from '../functools';
import { keysToLowerCase, removeItem } from '../helpers';
import type { SpecifyResource } from '../legacytypes';
import { commonText } from '../localization/common';
import { formsText } from '../localization/forms';
import { queryText } from '../localization/query';
import { hasToolPermission } from '../permissionutils';
import { fetchPickList } from '../picklistmixins';
import type { QueryField } from '../querybuilderutils';
import {
  addAuditLogFields,
  queryFieldsToFieldSpecs,
  sortTypes,
  unParseQueryFields,
} from '../querybuilderutils';
import type { QueryFieldSpec } from '../queryfieldspec';
import { createResource } from '../resource';
import { getModel, schema } from '../schema';
import type { SpecifyModel } from '../specifymodel';
import { treeRanksPromise } from '../treedefinitions';
import type { RA } from '../types';
import { defined } from '../types';
import { generateMappingPathPreview } from '../wbplanviewmappingpreview';
import { Button, Container, H3 } from './basic';
import { loadingGif, SortIndicator, TableIcon } from './common';
import { ErrorBoundary, fail } from './errorboundary';
import { useAsyncState, useBooleanState, useTriggerState } from './hooks';
import {
  RecordSetCreated,
  recordSetFromQueryLoading,
} from './querybuildercomponents';
import { QueryResults } from './queryresults';
import { QueryToForms } from './querytoforms';
import { QueryToMap } from './querytomap';
import { deserializeResource } from './resource';
import { ResourceView } from './resourceview';

function TableHeaderCell({
  fieldSpec,
  sortConfig,
  onSortChange: handleSortChange,
}: {
  readonly fieldSpec: QueryFieldSpec | undefined;
  readonly sortConfig: QueryField['sortType'];
  readonly onSortChange?: (sortType: QueryField['sortType']) => void;
}): JSX.Element {
  const tableName = fieldSpec?.getField()?.model.name;

  const content =
    typeof fieldSpec === 'object' ? (
      <>
        {tableName && <TableIcon label name={tableName} />}
        {generateMappingPathPreview(
          fieldSpec.baseTable.name,
          fieldSpec.toMappingPath()
        )}
      </>
    ) : undefined;
  return (
    <div
      className="sticky w-full min-w-max border-b border-gray-500
        bg-brand-100 p-1 [inset-block-start:_0] [z-index:2] dark:bg-brand-500"
      role={typeof content === 'object' ? `columnheader` : 'cell'}
    >
      {typeof handleSortChange === 'function' ? (
        <Button.LikeLink
          onClick={(): void =>
            handleSortChange?.(
              sortTypes[(sortTypes.indexOf(sortConfig) + 1) % sortTypes.length]
            )
          }
        >
          {content}
          {typeof sortConfig === 'string' && (
            <SortIndicator
              fieldName="field"
              sortConfig={{
                sortField: 'field',
                ascending: sortConfig === 'ascending',
              }}
            />
          )}
        </Button.LikeLink>
      ) : (
        content
      )}
    </div>
  );
}

/**
 * Create a record set frm selected records.
 * See also `MakeRecordSetButton`
 */
function CreateRecordSet({
  getIds,
  baseTableName,
}: {
  readonly getIds: () => RA<number>;
  readonly baseTableName: keyof Tables;
}): JSX.Element {
  const [state, setState] = React.useState<
    | State<'Editing', { readonly recordSet: SpecifyResource<RecordSet> }>
    | State<'Main'>
    | State<'Saved', { readonly recordSet: SpecifyResource<RecordSet> }>
    | State<'Saving'>
  >({ type: 'Main' });

  return (
    <>
      <Button.Small
        aria-haspopup="dialog"
        onClick={(): void =>
          setState({
            type: 'Editing',
            recordSet: new schema.models.RecordSet.Resource(),
          })
        }
      >
        {queryText('createRecordSet')}
      </Button.Small>
      {state.type === 'Editing' && (
        <ResourceView
          canAddAnother={false}
          dialog="modal"
          isDependent={false}
          isSubForm={false}
          mode="edit"
          resource={state.recordSet}
          onClose={(): void => setState({ type: 'Main' })}
          onDeleted={f.never}
          onSaved={f.never}
          onSaving={(): false => {
            setState({ type: 'Saving' });
            createResource('RecordSet', {
              ...serializeResource(state.recordSet),
              version: 1,
              type: 0,
              dbTableId: defined(getModel(baseTableName)).tableId,
              /*
               * Back-end has an exception for RecordSet table allowing passing
               * inline data for record set items.
               * Need to make IDs unique as query may return results with
               * duplicate IDs (when displaying a -to-many relationship)
               */
              // @ts-expect-error
              recordSetItems: f.unique(getIds()).map((id) => ({
                recordId: id,
              })),
            })
              .then((recordSet) =>
                setState({
                  type: 'Saved',
                  recordSet: deserializeResource(recordSet),
                })
              )
              .catch((error) => {
                setState({ type: 'Main' });
                fail(error);
              });
            return false;
          }}
        />
      )}
      {state.type === 'Saving' && recordSetFromQueryLoading}
      {state.type === 'Saved' && (
        <RecordSetCreated
          recordSet={state.recordSet}
          onClose={(): void => setState({ type: 'Main' })}
        />
      )}
    </>
  );
}

const threshold = 20;
const isScrolledBottom = (scrollable: HTMLElement): boolean =>
  scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight >
  threshold;

const fetchTreeRanks = async (): Promise<true> => treeRanksPromise.then(f.true);

export function QueryResultsTable({
  model,
  label = commonText('results'),
  hasIdField,
  fetchSize,
  fetchResults,
  totalCount: initialTotalCount,
  fieldSpecs,
  initialData,
  sortConfig,
  onSelected: handleSelected,
  onSortChange: handleSortChange,
  createRecordSet,
  extraButtons,
  tableClassName,
}: {
  readonly model: SpecifyModel;
  readonly label?: string;
  readonly hasIdField: boolean;
  /**
   * A hint for how many records a fetch can return at maximum. This is used to
   * optimize fetch performance when user is using "Browse in forms" and going
   * backwards in the list from the end.
   */
  readonly fetchSize: number;
  readonly fetchResults: (
    offset: number
  ) => Promise<RA<RA<number | string | null>>>;
  readonly totalCount: number | undefined;
  readonly fieldSpecs: RA<QueryFieldSpec>;
  // This is undefined when running query in countOnly mode
  readonly initialData: RA<RA<number | string | null>> | undefined;
  readonly sortConfig?: RA<QueryField['sortType']>;
  readonly onSelected?: (selected: RA<number>) => void;
  readonly onSortChange?: (
    fieldSpec: QueryFieldSpec,
    direction: 'ascending' | 'descending' | undefined
  ) => void;
  readonly createRecordSet: JSX.Element | undefined;
  readonly extraButtons: JSX.Element | undefined;
  readonly tableClassName?: string;
}): JSX.Element {
  const [isFetching, handleFetching, handleFetched] = useBooleanState();
  /*
   * Warning:
   * "results" can be a sparse array. Using sparse array to allow
   * efficiently retrieving the last query result in a query that returns
   * hundreds of thousands of results.
   */
  const [results, setResults] = useTriggerState<
    RA<RA<number | string | null> | undefined> | undefined
  >(initialData);

  const [pickListsLoaded = false] = useAsyncState(
    React.useCallback(
      async () =>
        // Fetch all pick lists so that they are accessible synchronously later
        Promise.all(
          fieldSpecs.map((fieldSpec) =>
            typeof fieldSpec.parser.pickListName === 'string'
              ? fetchPickList(fieldSpec.parser.pickListName)
              : undefined
          )
        ).then(f.true),
      [fieldSpecs]
    ),
    /*
     * Loading screen is disabled because it was interrupting auto-scroll to
     * query results in query builder.
     * See https://github.com/specify/specify7/issues/1354
     */
    false
  );

  const [treeRanksLoaded = false] = useAsyncState(fetchTreeRanks, false);

  const [totalCount, setTotalCount] = useTriggerState(initialTotalCount);

  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<number>>(
    new Set()
  );
  const lastSelectedRow = React.useRef<number | undefined>(undefined);
  // Unselect all rows when query is reRun
  React.useEffect(() => setSelectedRows(new Set()), [fieldSpecs]);

  function fetchMore(
    index?: number,
    currentResults:
      | RA<RA<number | string | null> | undefined>
      | undefined = results
  ): void {
    if (!Array.isArray(currentResults) || isFetching) return;
    const naiveFetchIndex = index ?? currentResults.length;
    const fetchIndex =
      /* If navigating backwards, fetch the previous 40 records */
      typeof index === 'number' &&
      typeof currentResults[index + 1] === 'object' &&
      currentResults[index - 1] === undefined &&
      index > fetchSize
        ? naiveFetchIndex - fetchSize + 1
        : naiveFetchIndex;
    if (currentResults[fetchIndex] !== undefined) return;
    handleFetching();
    fetchResults(fetchIndex)
      .then((newResults) => {
        // Not using Array.from() so as not to expand the sparse array
        const resultsCopy = currentResults.slice();
        /*
         * This extends the sparse array to fit new results. Without this,
         * splice won't place the results in the correct place.
         */
        resultsCopy[fetchIndex] = resultsCopy[fetchIndex] ?? undefined;
        resultsCopy.splice(fetchIndex, newResults.length, ...newResults);
        return resultsCopy;
      })
      .then(setResults)
      .then(handleFetched)
      .catch(fail);
  }

  React.useEffect(fetchMore, []);

  const showResults =
    Array.isArray(results) &&
    fieldSpecs.length > 0 &&
    pickListsLoaded &&
    treeRanksLoaded;

  const undefinedResult = results?.indexOf(undefined);
  const loadedResults = (
    undefinedResult === -1 ? results : results?.slice(0, undefinedResult)
  ) as RA<RA<number | string | null>> | undefined;

  return (
    <Container.Base className="w-full bg-[color:var(--form-background)]">
      <div className="flex items-center gap-2">
        <H3>{`${label}: (${
          selectedRows.size === 0
            ? totalCount ?? commonText('loading')
            : `${selectedRows.size}/${totalCount ?? commonText('loading')}`
        })`}</H3>
        {selectedRows.size > 0 && (
          <Button.Small onClick={(): void => setSelectedRows(new Set())}>
            {formsText('deselectAll')}
          </Button.Small>
        )}
        <div className="flex-1 -ml-2" />
        {extraButtons}
        {hasIdField &&
        Array.isArray(results) &&
        Array.isArray(loadedResults) &&
        results.length > 0 ? (
          <>
            {hasToolPermission('recordSets', 'create') ? (
              selectedRows.size > 0 ? (
                <CreateRecordSet
                  /*
                   * This is needed so that IDs are in the same order as they
                   * are in query results (selectedRows set may be out of order
                   * if records were selected out of order)
                   */
                  baseTableName={fieldSpecs[0].baseTable.name}
                  getIds={(): RA<number> =>
                    defined(loadedResults)
                      .filter((result) =>
                        selectedRows.has(result[queryIdField] as number)
                      )
                      .map((result) => result[queryIdField] as number)
                  }
                />
              ) : (
                createRecordSet
              )
            ) : undefined}
            <QueryToMap
              fieldSpecs={fieldSpecs}
              model={model}
              results={loadedResults}
              selectedRows={selectedRows}
            />
            <QueryToForms
              model={model}
              results={results}
              selectedRows={selectedRows}
              totalCount={totalCount}
              onDelete={(index): void => {
                setTotalCount(defined(totalCount) - 1);
                setResults(removeItem(results, index));
                setSelectedRows(
                  new Set(
                    Array.from(selectedRows).filter(
                      (id) => id !== loadedResults[index][queryIdField]
                    )
                  )
                );
              }}
              onFetchMore={isFetching ? undefined : fetchMore}
            />
          </>
        ) : undefined}
      </div>
      <div
        // REFACTOR: turn this into a reusable table component
        className={`
          grid-table auto-rows-min overflow-auto rounded
          ${tableClassName ?? ''}
          ${showResults ? 'border-b border-gray-500' : ''}
          ${
            hasIdField
              ? 'grid-cols-[min-content_min-content_repeat(var(--columns),auto)]'
              : 'grid-cols-[repeat(var(--columns),auto)]'
          }
       `}
        role="table"
        style={
          {
            '--columns': fieldSpecs.length,
          } as React.CSSProperties
        }
        onScroll={
          showResults && (isFetching || results.length === totalCount)
            ? undefined
            : ({ target }): void =>
                isScrolledBottom(target as HTMLElement)
                  ? undefined
                  : fetchMore()
        }
      >
        {showResults && (
          <div role="rowgroup">
            <div role="row">
              {hasIdField && (
                <>
                  <TableHeaderCell
                    fieldSpec={undefined}
                    sortConfig={undefined}
                    onSortChange={undefined}
                  />
                  <TableHeaderCell
                    fieldSpec={undefined}
                    sortConfig={undefined}
                    onSortChange={undefined}
                  />
                </>
              )}
              {fieldSpecs.map((fieldSpec, index) => (
                <TableHeaderCell
                  fieldSpec={fieldSpec}
                  key={index}
                  sortConfig={sortConfig?.[index]}
                  onSortChange={
                    typeof handleSortChange === 'function'
                      ? (sortType): void =>
                          handleSortChange?.(fieldSpec, sortType)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
        <div role="rowgroup">
          {showResults && Array.isArray(loadedResults) ? (
            <QueryResults
              fieldSpecs={fieldSpecs}
              hasIdField={hasIdField}
              model={model}
              results={loadedResults}
              selectedRows={selectedRows}
              onSelected={(rowIndex, isSelected, isShiftClick): void => {
                /*
                 * If shift/ctrl/cmd key was held during click, toggle all rows
                 * between the current one, and the last selected one
                 */
                const ids = (
                  isShiftClick && typeof lastSelectedRow.current === 'number'
                    ? Array.from(
                        {
                          length:
                            Math.abs(lastSelectedRow.current - rowIndex) + 1,
                        },
                        (_, index) =>
                          Math.min(lastSelectedRow.current!, rowIndex) + index
                      )
                    : [rowIndex]
                ).map(
                  (rowIndex) => loadedResults[rowIndex][queryIdField] as number
                );
                const newSelectedRows = [
                  ...Array.from(selectedRows).filter(
                    (id) => isSelected || !ids.includes(id)
                  ),
                  ...(isSelected ? ids : []),
                ];
                setSelectedRows(new Set(newSelectedRows));
                handleSelected?.(newSelectedRows);

                lastSelectedRow.current = rowIndex;
              }}
            />
          ) : undefined}
          {isFetching || (!showResults && Array.isArray(results)) ? (
            <div className="col-span-full" role="cell">
              {loadingGif}
            </div>
          ) : undefined}
        </div>
      </div>
    </Container.Base>
  );
}

/** Record ID column index in Query Results when not in distinct mode */
export const queryIdField = 0;
// TODO: [FEATURE] allow customizing this and other constants as make sense
const fetchSize = 40;

export function QueryResultsWrapper({
  baseTableName,
  model,
  queryRunCount,
  queryResource,
  fields,
  recordSetId,
  createRecordSet,
  extraButtons,
  onSelected: handleSelected,
  onSortChange: handleSortChange,
}: {
  readonly baseTableName: keyof Tables;
  readonly model: SpecifyModel;
  readonly queryRunCount: number;
  readonly queryResource: SpecifyResource<SpQuery>;
  readonly fields: RA<QueryField>;
  readonly recordSetId: number | undefined;
  readonly createRecordSet: JSX.Element | undefined;
  readonly extraButtons: JSX.Element;
  readonly onSelected?: (selected: RA<number>) => void;
  readonly onSortChange?: (
    fieldIndex: number,
    direction: 'ascending' | 'descending' | undefined
  ) => void;
}): JSX.Element | null {
  const fetchResults = React.useCallback(
    async (offset: number) =>
      ajax<{ readonly results: RA<RA<number | string | null>> }>(
        '/stored_query/ephemeral/',
        {
          method: 'POST',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { Accept: 'application/json' },
          body: keysToLowerCase({
            ...queryResource.toJSON(),
            fields: unParseQueryFields(
              baseTableName,
              addAuditLogFields(baseTableName, fields)
            ),
            recordSetId,
            limit: fetchSize,
            offset,
          }),
        }
      ).then(({ data }) => data.results),
    [fields, baseTableName, queryResource, recordSetId]
  );

  /*
   * Need to store all props in a state so that query field edits do not affect
   * the query results until query is reRun
   */
  const [props, setProps] = React.useState<
    Omit<Parameters<typeof QueryResultsTable>[0], 'totalCount'> | undefined
  >(undefined);

  const [totalCount, setTotalCount] = React.useState<number | undefined>(
    undefined
  );

  const previousQueryRunCount = React.useRef(0);
  React.useEffect(() => {
    if (queryRunCount === previousQueryRunCount.current) return;
    previousQueryRunCount.current = queryRunCount;
    // Display the loading GIF
    setProps(undefined);

    const allFields = addAuditLogFields(baseTableName, fields);

    setTotalCount(undefined);
    ajax<{ readonly count: number }>('/stored_query/ephemeral/', {
      method: 'POST',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Accept: 'application/json' },
      body: keysToLowerCase({
        ...queryResource.toJSON(),
        fields: unParseQueryFields(baseTableName, allFields),
        recordSetId,
        countOnly: true,
      }),
    })
      .then(({ data }) => setTotalCount(data.count))
      .catch(fail);

    const displayedFields = allFields.filter((field) => field.isDisplay);
    const initialData =
      // Run as count only if there are no visible fields
      queryResource.get('countOnly') === true || displayedFields.length === 0
        ? Promise.resolve(undefined)
        : fetchResults(0);
    const fieldSpecs = queryFieldsToFieldSpecs(
      baseTableName,
      displayedFields
    ).map(([_field, fieldSpec]) => fieldSpec);

    initialData
      .then((initialData) =>
        setProps({
          model,
          hasIdField: queryResource.get('selectDistinct') !== true,
          fetchSize,
          fetchResults,
          fieldSpecs,
          initialData,
          sortConfig: fields
            .filter(({ isDisplay }) => isDisplay)
            .map((field) => field.sortType),
          onSortChange:
            typeof handleSortChange === 'function'
              ? (fieldSpec, direction) => {
                  /*
                   * If some fields are not displayed, visual index and actual field
                   * index differ
                   */
                  const index = fieldSpecs.indexOf(fieldSpec);
                  const field = displayedFields[index];
                  const originalIndex = allFields.indexOf(field);
                  handleSortChange(originalIndex, direction);
                }
              : undefined,
          createRecordSet,
          extraButtons,
          onSelected: handleSelected,
        })
      )
      .catch(fail);
  }, [
    fields,
    baseTableName,
    fetchResults,
    queryResource,
    queryRunCount,
    recordSetId,
    model,
  ]);

  return props === undefined ? (
    queryRunCount === 0 ? null : (
      <div className="snap-start flex-1">{loadingGif}</div>
    )
  ) : (
    <div
      className={`
        flex flex-1 snap-start
        ${typeof handleSelected === 'function' ? 'max-h-[70vh]' : ''}
      `}
    >
      <ErrorBoundary dismissable>
        <QueryResultsTable {...props} totalCount={totalCount} />
      </ErrorBoundary>
    </div>
  );
}
