import React from 'react';
import type { LocalizedString } from 'typesafe-i18n';
import type { State } from 'typesafe-reducer';

import { useAsyncState } from '../../hooks/useAsyncState';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useTriggerState } from '../../hooks/useTriggerState';
import { commonText } from '../../localization/common';
import { interactionsText } from '../../localization/interactions';
import { queryText } from '../../localization/query';
import { f } from '../../utils/functools';
import { type GetOrSet, type GetSet, type R, type RA } from '../../utils/types';
import { removeKey } from '../../utils/utils';
import { Container, H3 } from '../Atoms';
import { Button } from '../Atoms/Button';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import { createResource } from '../DataModel/resource';
import {
  deserializeResource,
  serializeResource,
} from '../DataModel/serializers';
import type { SpecifyTable } from '../DataModel/specifyTable';
import { strictGetTable, tables } from '../DataModel/tables';
import type { RecordSet, SpQuery, Tables } from '../DataModel/types';
import { raise, softFail } from '../Errors/Crash';
import { recordSetView } from '../FormParse/webOnlyViews';
import { ResourceView } from '../Forms/ResourceView';
import { treeRanksPromise } from '../InitialContext/treeRanks';
import { RecordMergingLink } from '../Merging';
import { loadingGif } from '../Molecules';
import { SortIndicator } from '../Molecules/Sorting';
import { TableIcon } from '../Molecules/TableIcon';
import {
  hasPermission,
  hasTablePermission,
  hasToolPermission,
} from '../Permissions/helpers';
import { fetchPickList } from '../PickLists/fetch';
import { userPreferences } from '../Preferences/userPreferences';
import { generateMappingPathPreview } from '../WbPlanView/mappingPreview';
import { RecordSetCreated, recordSetFromQueryLoading } from './Components';
import type { QueryFieldSpec } from './fieldSpec';
import type { QueryField } from './helpers';
import { sortTypes } from './helpers';
import { QueryResultsTable } from './ResultsTable';
import { QueryToForms } from './ToForms';
import { QueryToMap } from './ToMap';

export type QueryResultRow = RA<number | string | null>;

type Props = {
  readonly table: SpecifyTable;
  readonly label?: LocalizedString;
  readonly hasIdField: boolean;
  readonly queryResource: SpecifyResource<SpQuery> | undefined;
  /**
   * A hint for how many records a fetch can return at maximum. This is used to
   * optimize fetch performance when using "Browse in forms" and going
   * backwards in the list from the end.
   */
  readonly fetchSize: number;
  readonly fetchResults:
    | ((offset: number) => Promise<RA<QueryResultRow>>)
    | undefined;
  readonly totalCount: number | undefined;
  readonly fieldSpecs: RA<QueryFieldSpec>;
  readonly displayedFields: RA<QueryField>;
  readonly allFields: RA<QueryField>;
  // This is undefined when running query in countOnly mode
  readonly initialData: RA<QueryResultRow> | undefined;
  readonly sortConfig?: RA<QueryField['sortType']>;
  readonly onSelected?: (selected: RA<number>) => void;
  readonly onSortChange?: (
    fieldSpec: QueryFieldSpec,
    direction: 'ascending' | 'descending' | undefined
  ) => void;
  readonly onReRun: () => void;
  readonly createRecordSet: JSX.Element | undefined;
  readonly extraButtons: JSX.Element | undefined;
  readonly tableClassName?: string;
  readonly selectedRows: GetSet<ReadonlySet<number>>;
  readonly resultsRef?: React.MutableRefObject<
    RA<QueryResultRow | undefined> | undefined
  >;
};

export function QueryResults(props: Props): JSX.Element {
  const {
    table,
    label = commonText.results(),
    hasIdField,
    queryResource,
    fetchResults,
    fieldSpecs,
    allFields,
    initialData,
    sortConfig,
    onSelected: handleSelected,
    onSortChange: handleSortChange,
    onReRun: handleReRun,
    createRecordSet,
    extraButtons,
    tableClassName = '',
    selectedRows: [selectedRows, setSelectedRows],
    resultsRef,
    displayedFields,
  } = props;

  const {
    results: [results, setResults],
    onFetchMore: handleFetchMore,
    totalCount: [totalCount, setTotalCount],
    canFetchMore,
  } = useFetchQueryResults(props);

  const visibleFieldSpecs = fieldSpecs.filter(({ isPhantom }) => !isPhantom);
  if (resultsRef !== undefined) resultsRef.current = results;

  const [pickListsLoaded = false] = useAsyncState(
    React.useCallback(
      async () =>
        // Fetch all pick lists so that they are accessible synchronously later
        Promise.all(
          fieldSpecs.map(async (fieldSpec) =>
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

  const lastSelectedRow = React.useRef<number | undefined>(undefined);
  // Unselect all rows when query is reRun
  React.useEffect(() => setSelectedRows(new Set()), [fieldSpecs]);

  const showResults =
    Array.isArray(results) &&
    fieldSpecs.length > 0 &&
    pickListsLoaded &&
    treeRanksLoaded;

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const { isFetching, handleScroll } = useInfiniteScroll(
    canFetchMore ? handleFetchMore : undefined,
    scrollerRef
  );

  const undefinedResult = results?.indexOf(undefined);
  const loadedResults = (
    undefinedResult === -1 ? results : results?.slice(0, undefinedResult)
  ) as RA<QueryResultRow> | undefined;

  // TEST: try deleting while records are being fetched
  /**
   * Note: this may be called with a recordId that is not part of query results
   */
  const handleDelete = React.useCallback(
    (recordId: number): void => {
      let removeCount = 0;
      function newResults(results: RA<QueryResultRow | undefined> | undefined) {
        if (!Array.isArray(results) || totalCount === undefined) return;
        const newResults = results.filter(
          (result) => result?.[queryIdField] !== recordId
        );
        removeCount = results.length - newResults.length;
        if (resultsRef !== undefined) resultsRef.current = newResults;
        return newResults;
      }
      setResults(newResults(results));
      if (removeCount === 0) return;
      setTotalCount((totalCount) =>
        totalCount === undefined ? undefined : totalCount - removeCount
      );
      const newSelectedRows = (selectedRows: ReadonlySet<number>) =>
        new Set(Array.from(selectedRows).filter((id) => id !== recordId));
      setSelectedRows(newSelectedRows(selectedRows));
    },
    [setResults, setTotalCount, totalCount]
  );

  const [showLineNumber] = userPreferences.use(
    'queryBuilder',
    'appearance',
    'showLineNumber'
  );

  return (
    <Container.Base className="w-full bg-[color:var(--form-background)]">
      <div className="flex items-center items-stretch gap-2">
        <H3>
          {commonText.colonLine({
            label,
            value: `(${
              selectedRows.size === 0
                ? totalCount ?? commonText.loading()
                : `${selectedRows.size}/${totalCount ?? commonText.loading()}`
            })`,
          })}
        </H3>
        {selectedRows.size > 0 && (
          <Button.Small onClick={(): void => setSelectedRows(new Set())}>
            {interactionsText.deselectAll()}
          </Button.Small>
        )}
        <div className="-ml-2 flex-1" />
        {displayedFields.length > 0 && visibleFieldSpecs.length > 0
          ? extraButtons
          : null}
        {hasIdField &&
        Array.isArray(results) &&
        Array.isArray(loadedResults) &&
        results.length > 0 &&
        typeof fetchResults === 'function' &&
        visibleFieldSpecs.length > 0 ? (
          <>
            {hasPermission('/record/replace', 'update') &&
              hasTablePermission(table.name, 'update') && (
                <RecordMergingLink
                  selectedRows={selectedRows}
                  table={table}
                  onDeleted={handleDelete}
                  onMerged={handleReRun}
                />
              )}
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
                    loadedResults
                      .filter((result) =>
                        selectedRows.has(result[queryIdField] as number)
                      )
                      .map((result) => result[queryIdField] as number)
                  }
                  queryResource={queryResource}
                />
              ) : (
                createRecordSet
              )
            ) : undefined}
            <QueryToMap
              fields={allFields}
              fieldSpecs={fieldSpecs}
              results={loadedResults}
              selectedRows={selectedRows}
              table={table}
              totalCount={totalCount}
              onFetchMore={
                canFetchMore && !isFetching ? handleFetchMore : undefined
              }
            />
            <QueryToForms
              results={results}
              selectedRows={selectedRows}
              table={table}
              totalCount={totalCount}
              onDelete={handleDelete}
              onFetchMore={isFetching ? undefined : handleFetchMore}
            />
          </>
        ) : undefined}
      </div>
      <div
        // REFACTOR: turn this into a reusable table component
        className={`
          grid-table auto-rows-min
          grid-cols-[repeat(var(--meta-columns),min-content)_repeat(var(--columns),auto)]
          overflow-auto rounded
          ${tableClassName}
          ${showResults ? 'border-b border-gray-500' : ''}
       `}
        ref={scrollerRef}
        role="table"
        style={
          {
            '--columns': visibleFieldSpecs.length,
            '--meta-columns': (showLineNumber ? 1 : 0) + (hasIdField ? 2 : 0),
          } as React.CSSProperties
        }
        onScroll={showResults && !canFetchMore ? undefined : handleScroll}
      >
        {showResults && visibleFieldSpecs.length > 0 ? (
          <div role="rowgroup">
            <div role="row">
              {showLineNumber && (
                <TableHeaderCell
                  fieldSpec={undefined}
                  sortConfig={undefined}
                  onSortChange={undefined}
                />
              )}
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
              {fieldSpecs.map((fieldSpec, index) =>
                fieldSpec.isPhantom ? undefined : (
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
                )
              )}
            </div>
          </div>
        ) : null}
        <div role="rowgroup">
          {showResults &&
          visibleFieldSpecs.length > 0 &&
          Array.isArray(loadedResults) &&
          Array.isArray(initialData) ? (
            <QueryResultsTable
              fieldSpecs={fieldSpecs}
              hasIdField={hasIdField}
              results={loadedResults}
              selectedRows={selectedRows}
              table={table}
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

export function useFetchQueryResults({
  initialData,
  fetchResults,
  totalCount: initialTotalCount,
  fetchSize,
}: Pick<Props, 'fetchResults' | 'fetchSize' | 'initialData' | 'totalCount'>): {
  readonly results: GetOrSet<RA<QueryResultRow | undefined> | undefined>;
  readonly onFetchMore: (index?: number) => Promise<RA<QueryResultRow> | void>;
  readonly totalCount: GetOrSet<number | undefined>;
  readonly canFetchMore: boolean;
} {
  /*
   * Warning:
   * "results" can be a sparse array. Using sparse array to allow
   * efficiently retrieving the last query result in a query that returns
   * hundreds of thousands of results.
   */
  const getSetResults = useTriggerState<
    RA<QueryResultRow | undefined> | undefined
  >(initialData);
  const [results, setResults] = getSetResults;
  const resultsRef = React.useRef(results);
  const handleSetResults: GetOrSet<
    RA<QueryResultRow | undefined> | undefined
  >[1] = React.useCallback(
    (results) => {
      const resolved =
        typeof results === 'function' ? results(resultsRef.current) : results;
      setResults(resolved);
      resultsRef.current = resolved;
    },
    [setResults]
  );

  // Queue for fetching
  const fetchersRef = React.useRef<R<Promise<RA<QueryResultRow> | void>>>({});

  const getSetTotalCount = useTriggerState(initialTotalCount);
  const [totalCount] = getSetTotalCount;
  const canFetchMore =
    !Array.isArray(results) ||
    totalCount === undefined ||
    results.length < totalCount;

  const handleFetchMore = React.useCallback(
    async (index?: number): Promise<RA<QueryResultRow> | void> => {
      const currentResults = resultsRef.current;
      const canFetch = Array.isArray(currentResults);

      if (!canFetch || fetchResults === undefined) return undefined;

      const alreadyFetched =
        currentResults.length === totalCount &&
        !currentResults.includes(undefined);
      if (alreadyFetched) return undefined;

      /*
       * REFACTOR: make this smarter
       *   when going to the last record, fetch 40 before the last
       *   when somewhere in the middle, adjust the fetch region to get the
       *   most unhatched records fetched
       */
      const naiveFetchIndex = index ?? currentResults.length;
      if (currentResults[naiveFetchIndex] !== undefined) return undefined;

      const fetchIndex =
        /* If navigating backwards, fetch the previous 40 records */
        typeof index === 'number' &&
        typeof currentResults[index + 1] === 'object' &&
        currentResults[index - 1] === undefined &&
        index > fetchSize
          ? naiveFetchIndex - fetchSize + 1
          : naiveFetchIndex;

      // Prevent concurrent fetching in different places
      fetchersRef.current[fetchIndex] ??= fetchResults(fetchIndex)
        .then(async (newResults) => {
          if (
            process.env.NODE_ENV === 'development' &&
            newResults.length > fetchSize
          )
            softFail(
              new Error(
                `Returned ${newResults.length} results, when expected at most ${fetchSize}`
              )
            );

          // Results might have changed while fetching
          const newCurrentResults = resultsRef.current ?? currentResults;

          // Not using Array.from() so as not to expand the sparse array
          const combinedResults = newCurrentResults.slice();
          /*
           * This extends the sparse array to fit new results. Without this,
           * splice won't place the results in the correct place.
           */
          combinedResults[fetchIndex] ??= undefined;
          combinedResults.splice(fetchIndex, newResults.length, ...newResults);

          handleSetResults(combinedResults);

          fetchersRef.current = removeKey(
            fetchersRef.current,
            fetchIndex.toString()
          );

          if (typeof index === 'number' && index >= combinedResults.length)
            return handleFetchMore(index);
          return newResults;
        })
        .catch(raise);

      return fetchersRef.current[fetchIndex];
    },
    [fetchResults, fetchSize, setResults, totalCount]
  );

  return {
    results: [results, handleSetResults],
    onFetchMore: handleFetchMore,
    totalCount: getSetTotalCount,
    canFetchMore,
  };
}

function TableHeaderCell({
  fieldSpec,
  sortConfig,
  onSortChange: handleSortChange,
}: {
  readonly fieldSpec: QueryFieldSpec | undefined;
  readonly sortConfig: QueryField['sortType'];
  readonly onSortChange?: (sortType: QueryField['sortType']) => void;
}): JSX.Element {
  // TableName refers to the table the filed is from, not the base table name of the query
  const tableName = fieldSpec?.table?.name;

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
      className="sticky z-[2] w-full min-w-max border-b
        border-gray-500 bg-brand-100 p-1 [inset-block-start:_0] dark:bg-brand-500"
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
  queryResource,
}: {
  readonly getIds: () => RA<number>;
  readonly baseTableName: keyof Tables;
  readonly queryResource: SpecifyResource<SpQuery> | undefined;
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
        onClick={(): void => {
          const recordSet = new tables.RecordSet.Resource();
          if (queryResource !== undefined && !queryResource.isNew())
            recordSet.set('name', queryResource.get('name'));
          setState({
            type: 'Editing',
            recordSet,
          });
        }}
      >
        {queryText.createRecordSet({
          recordSetTable: tables.RecordSet.label,
        })}
      </Button.Small>
      {state.type === 'Editing' && (
        <ResourceView
          dialog="modal"
          isDependent={false}
          isSubForm={false}
          resource={state.recordSet}
          viewName={recordSetView}
          onAdd={undefined}
          onClose={(): void => setState({ type: 'Main' })}
          onDeleted={f.never}
          onSaved={f.never}
          onSaving={(): false => {
            setState({ type: 'Saving' });
            createResource('RecordSet', {
              ...serializeResource(state.recordSet),
              version: 1,
              type: 0,
              dbTableId: strictGetTable(baseTableName).tableId,
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
                raise(error);
              });
            return false;
          }}
        />
      )}
      {state.type === 'Saving' && recordSetFromQueryLoading()}
      {state.type === 'Saved' && (
        <RecordSetCreated
          recordSet={state.recordSet}
          onClose={(): void => setState({ type: 'Main' })}
        />
      )}
    </>
  );
}

const fetchTreeRanks = async (): Promise<true> => treeRanksPromise.then(f.true);

/** Record ID column index in Query Results when not in distinct mode */
export const queryIdField = 0;
