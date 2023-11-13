import React from 'react';
import { useParams } from 'react-router-dom';

import { useSearchParameter } from '../../hooks/navigation';
import { useAsyncState, usePromise } from '../../hooks/useAsyncState';
import { useBooleanState } from '../../hooks/useBooleanState';
import { useCachedState } from '../../hooks/useCachedState';
import { useErrorContext } from '../../hooks/useErrorContext';
import { useId } from '../../hooks/useId';
import { commonText } from '../../localization/common';
import { treeText } from '../../localization/tree';
import type { RA } from '../../utils/types';
import { localized } from '../../utils/types';
import { caseInsensitiveHash, toggleItem } from '../../utils/utils';
import { Container, H2 } from '../Atoms';
import { Button } from '../Atoms/Button';
import type {
  AnyTree,
  FilterTablesByEndsWith,
  SerializedResource,
} from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { SpecifyTable } from '../DataModel/specifyTable';
import { getTable, tables } from '../DataModel/tables';
import { ErrorBoundary } from '../Errors/ErrorBoundary';
import { useMenuItem } from '../Header/MenuContext';
import { getPref } from '../InitialContext/remotePrefs';
import { isTreeTable, treeRanksPromise } from '../InitialContext/treeRanks';
import { useTitle } from '../Molecules/AppTitle';
import { RecordEdit, ResourceEdit } from '../Molecules/ResourceLink';
import { TableIcon } from '../Molecules/TableIcon';
import { ProtectedTree } from '../Permissions/PermissionDenied';
import { useHighContrast } from '../Preferences/Hooks';
import { userPreferences } from '../Preferences/userPreferences';
import { NotFoundView } from '../Router/NotFoundView';
import { formatUrl } from '../Router/queryString';
import { TreeViewActions } from './Actions';
import type { Conformations, Row, Stats } from './helpers';
import {
  deserializeConformation,
  fetchRows,
  fetchStats,
  serializeConformation,
} from './helpers';
import { TreeRow } from './Row';
import { TreeViewSearch } from './Search';

export function TreeViewWrapper(): JSX.Element | null {
  useMenuItem('trees');
  const { tableName = '' } = useParams();
  const treeName = getTable(tableName)?.name;
  const [treeDefinitions] = usePromise(treeRanksPromise, true);
  useErrorContext('treeDefinitions', treeDefinitions);

  const treeDefinition =
    typeof treeDefinitions === 'object' &&
    typeof treeName === 'string' &&
    isTreeTable(treeName)
      ? caseInsensitiveHash(treeDefinitions, treeName)
      : undefined;

  if (treeName === undefined || !isTreeTable(treeName)) return <NotFoundView />;
  return (
    <ProtectedTree action="read" treeName={treeName}>
      {typeof treeDefinition === 'object' ? (
        <TreeView
          tableName={treeName}
          treeDefinition={treeDefinition.definition}
          treeDefinitionItems={treeDefinition.ranks}
        />
      ) : null}
    </ProtectedTree>
  );
}

const treeToPref = {
  Geography: 'geography',
  Taxon: 'taxon',
  Storage: 'storage',
  GeologicTimePeriod: 'geologicTimePeriod',
  LithoStrat: 'lithoStrat',
} as const;
const defaultConformation: RA<never> = [];

// REFACTOR: extract logic into smaller hooks
function TreeView<SCHEMA extends AnyTree>({
  tableName,
  treeDefinition,
  treeDefinitionItems,
}: {
  readonly tableName: SCHEMA['tableName'];
  readonly treeDefinition: SpecifyResource<FilterTablesByEndsWith<'TreeDef'>>;
  readonly treeDefinitionItems: RA<
    SerializedResource<FilterTablesByEndsWith<'TreeDefItem'>>
  >;
}): JSX.Element | null {
  const table = tables[tableName] as SpecifyTable<AnyTree>;

  const rankIds = treeDefinitionItems.map(({ rankId }) => rankId);

  const [collapsedRanks, setCollapsedRanks] = useCachedState(
    'tree',
    `collapsedRanks${tableName}`
  );

  const [urlConformation, setUrlConformation] =
    useSearchParameter('conformation');

  const [conformation = defaultConformation, setConformation] = useCachedState(
    'tree',
    `conformations${tableName}`
  );

  React.useEffect(
    () => setUrlConformation(serializeConformation(conformation)),
    [conformation, setUrlConformation]
  );
  React.useEffect(() => {
    if (typeof urlConformation !== 'string') return;
    const parsed = deserializeConformation(urlConformation);
    setConformation(parsed);
  }, [setConformation]);

  useTitle(treeText.treeViewTitle({ treeName: table.label }));

  // Node sort order
  const sortField = getPref(`${tableName as 'Geography'}.treeview_sort_field`);

  const includeAuthor = getPref(`TaxonTreeEditor.DisplayAuthor`);

  const baseUrl = `/api/specify_tree/${tableName.toLowerCase()}/${
    treeDefinition.id
  }`;

  const getRows = React.useCallback(
    async (parentId: number | 'null') =>
      fetchRows(
        formatUrl(`${baseUrl}/${parentId}/${sortField}/`, {
          includeAuthor: includeAuthor.toString(),
        })
      ),
    [baseUrl, sortField]
  );

  const statsThreshold = getPref(
    `TreeEditor.Rank.Threshold.${tableName as 'Geography'}`
  );
  const getStats = React.useCallback(
    async (nodeId: number | 'null', rankId: number): Promise<Stats> =>
      rankId >= statsThreshold
        ? fetchStats(`${baseUrl}/${nodeId}/stats/`)
        : Promise.resolve({}),
    [baseUrl, statsThreshold]
  );

  const [rows, setRows] = useAsyncState<RA<Row>>(
    React.useCallback(async () => getRows('null'), [getRows]),
    true
  );
  const id = useId('tree-view');

  // FEATURE: synchronize focus path with the URL
  const [focusPath = [], setFocusPath] = useCachedState(
    'tree',
    `focusPath${tableName}`
  );
  const [focusedRow, setFocusedRow] = React.useState<Row | undefined>(
    undefined
  );

  const [actionRow, setActionRow] = React.useState<Row | undefined>(undefined);

  const searchBoxRef = React.useRef<HTMLInputElement | null>(null);
  const toolbarButtonRef = React.useRef<HTMLAnchorElement | null>(null);
  const [isEditingRanks, _, __, handleToggleEditingRanks] = useBooleanState();

  const highContrast = useHighContrast();
  const [treeAccentColor] = userPreferences.use(
    'treeEditor',
    treeToPref[tableName],
    'treeAccentColor'
  );
  const [synonymColor] = userPreferences.use(
    'treeEditor',
    treeToPref[tableName],
    'synonymColor'
  );

  return rows === undefined ? null : (
    <Container.Full>
      <header className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:overflow-x-visible">
        <TableIcon label name={table.name} />
        <H2 title={treeDefinition.get('remarks') ?? undefined}>
          {treeDefinition.get('name')}
        </H2>
        <ResourceEdit
          resource={treeDefinition}
          onSaved={(): void => globalThis.location.reload()}
        />
        <TreeViewSearch<SCHEMA>
          forwardRef={searchBoxRef}
          tableName={tableName}
          treeDefinitionItems={treeDefinitionItems}
          onFocusPath={setFocusPath}
        />
        <Button.Small
          aria-pressed={isEditingRanks}
          onClick={handleToggleEditingRanks}
        >
          {treeText.editRanks()}
        </Button.Small>
        <Button.Small
          disabled={conformation.length === 0}
          onClick={(): void => {
            setFocusPath([rows[0].nodeId]);
            setConformation([]);
          }}
        >
          {commonText.collapseAll()}
        </Button.Small>
        <span className="-ml-2 flex-1" />
        <ErrorBoundary dismissible>
          <TreeViewActions<SCHEMA>
            actionRow={actionRow}
            focusedRow={focusedRow}
            focusRef={toolbarButtonRef}
            ranks={rankIds}
            setFocusPath={setFocusPath}
            tableName={tableName}
            onChange={setActionRow}
            onRefresh={(): void => {
              // Force re-load
              setRows(undefined);
              globalThis.setTimeout(() => setRows(rows), 0);
            }}
          />
        </ErrorBoundary>
      </header>
      <div
        className={`
          grid-table flex-1 grid-cols-[repeat(var(--cols),auto)]
          content-start overflow-auto rounded from-[var(--edge-color)] via-[var(--middle-color)] to-[var(--edge-color)] p-2
          pt-0
          shadow-md shadow-gray-500 outline-none
          ${highContrast ? 'border dark:border-white' : 'bg-gradient-to-bl'}
        `}
        // First role is for screen readers. Second is for styling
        role="none table"
        style={
          {
            '--cols': treeDefinitionItems.length,
            '--middle-color': `${treeAccentColor}33`,
            '--edge-color': `${treeAccentColor}00`,
          } as React.CSSProperties
        }
        tabIndex={0}
        // When tree viewer is focused, move focus to last focused node
        onFocus={(event): void => {
          // Don't handle bubbled events
          if (event.currentTarget !== event.target) return;
          // If user wants to edit tree ranks, allow tree ranks to receive focus
          if (isEditingRanks) return;
          event.preventDefault();
          // Unset and set focus path to trigger a useEffect hook in <TreeNode>
          setFocusPath([-1]);
          globalThis.setTimeout(
            () =>
              setFocusPath(focusPath.length > 0 ? focusPath : [rows[0].nodeId]),
            0
          );
        }}
      >
        <div role="none rowgroup">
          <div role="none row">
            {treeDefinitionItems.map((rank, index, { length }) => {
              const rankName = rank.title || rank.name;
              return (
                <div
                  className={`
                    sticky top-0 whitespace-nowrap border border-transparent 
                    border-b-[color:var(--accent-color-300)] bg-[color:var(--background)] 
                    p-2 brightness-95 dark:brightness-125
                    ${index === 0 ? '-ml-2 rounded-bl pl-4' : ''}
                    ${index + 1 === length ? '-mr-2 rounded-br pr-4' : ''}
                  `}
                  key={index}
                  role="none columnheader"
                >
                  <Button.LikeLink
                    id={id(rank.rankId.toString())}
                    onClick={(): void =>
                      setCollapsedRanks(
                        toggleItem(collapsedRanks ?? [], rank.rankId)
                      )
                    }
                  >
                    {localized(
                      collapsedRanks?.includes(rank.rankId) ?? false
                        ? rankName[0]
                        : rankName
                    )}
                  </Button.LikeLink>
                  {isEditingRanks &&
                  collapsedRanks?.includes(rank.rankId) !== true ? (
                    <RecordEdit
                      resource={rank}
                      onSaved={(): void => globalThis.location.reload()}
                    />
                  ) : undefined}
                </div>
              );
            })}
          </div>
        </div>
        <ul role="tree rowgroup">
          {rows.map((row, index) => (
            <TreeRow
              actionRow={actionRow}
              collapsedRanks={collapsedRanks ?? []}
              conformation={
                conformation
                  ?.find(([id]) => id === row.nodeId)
                  ?.slice(1) as Conformations
              }
              focusPath={
                focusPath[0] === row.nodeId ? focusPath.slice(1) : undefined
              }
              getRows={getRows}
              getStats={getStats}
              key={row.nodeId}
              nodeStats={undefined}
              path={[]}
              rankNameId={id}
              ranks={rankIds}
              row={row}
              setFocusedRow={setFocusedRow}
              synonymColor={synonymColor}
              treeName={tableName}
              onAction={(action): void => {
                if (action === 'next')
                  if (rows[index + 1] === undefined) return undefined;
                  else setFocusPath([rows[index + 1].nodeId]);
                else if (action === 'previous' && index > 0)
                  setFocusPath([rows[index - 1].nodeId]);
                else if (action === 'previous' || action === 'parent')
                  setFocusPath([]);
                else if (action === 'focusPrevious')
                  toolbarButtonRef.current?.focus();
                else if (action === 'focusNext') searchBoxRef.current?.focus();
                return undefined;
              }}
              onChangeConformation={(newConformation): void =>
                setConformation([
                  ...(conformation?.filter(([id]) => id !== row.nodeId) ?? []),
                  ...(typeof newConformation === 'object'
                    ? ([[row.nodeId, ...newConformation]] as const)
                    : []),
                ])
              }
              onFocusNode={(newFocusPath): void =>
                setFocusPath([row.nodeId, ...newFocusPath])
              }
            />
          ))}
        </ul>
      </div>
    </Container.Full>
  );
}
