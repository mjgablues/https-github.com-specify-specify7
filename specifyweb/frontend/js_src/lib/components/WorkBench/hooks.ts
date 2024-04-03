import type Handsontable from 'handsontable';
import type { Events } from 'handsontable/pluginHooks';
import type { Action } from 'handsontable/plugins/undoRedo';

import { backEndText } from '../../localization/backEnd';
import { whitespaceSensitive } from '../../localization/utils';
import { Http } from '../../utils/ajax/definitions';
import { ping } from '../../utils/ajax/ping';
import { setCache } from '../../utils/cache';
import { f } from '../../utils/functools';
import type { RA } from '../../utils/types';
import { ensure, overwriteReadOnly } from '../../utils/types';
import { sortFunction } from '../../utils/utils';
import { oneRem } from '../Atoms';
import { schema } from '../DataModel/schema';
import { hasPermission } from '../Permissions/helpers';
import { getHotPlugin } from './handsontable';
import type { WbView } from './WbView';
import { Workbench } from './WbView';

export function getHotHooksReact(
  workbench: Workbench,
  physicalColToMappingCol: (physicalCol: number) => number | undefined,
  spreadsheetChanged: () => void,
  checkDeletedFail: (statusCode: number) => boolean
): Partial<Events> {
  let sortConfigIsSet: boolean = false;
  let hotCommentsContainerRepositionTimeout:
    | ReturnType<typeof setTimeout>
    | undefined = undefined;

  return ensure<Partial<Events>>()({
    /*
     * After cell is rendered, we need to reApply metaData classes
     * NOTE:
     * .issues are handled automatically by the comments plugin.
     * This is why, afterRenderer only has to handle the isModified and isNew
     * cases
     *
     */
    afterRenderer: (
      td: any,
      visualRow: number,
      visualCol: number,
      property: number | string,
      _value: string
    ) => {
      if (workbench.hot === undefined) {
        td.classList.add('text-gray-500');
        return;
      }
      const physicalRow = workbench.hot.toPhysicalRow(visualRow);
      const physicalCol =
        typeof property === 'number'
          ? property
          : workbench.hot.toPhysicalColumn(visualCol);
      if (physicalCol >= workbench.dataset.columns.length) return;
      const metaArray = workbench.cells?.cellMeta?.[physicalRow]?.[physicalCol];
      if (workbench.cells?.getCellMetaFromArray(metaArray!, 'isModified'))
        workbench.cells.runMetaUpdateEffects(
          td,
          'isModified',
          true,
          visualRow,
          visualCol
        );
      if (workbench.cells?.getCellMetaFromArray(metaArray!, 'isNew'))
        workbench.cells?.runMetaUpdateEffects(
          td,
          'isNew',
          true,
          visualRow,
          visualCol
        );
      if (workbench.cells!.getCellMetaFromArray(metaArray!, 'isSearchResult'))
        workbench.cells?.runMetaUpdateEffects(
          td,
          'isSearchResult',
          true,
          visualRow,
          visualCol
        );
      if (workbench.mappings?.mappedHeaders?.[physicalCol] === undefined)
        td.classList.add('text-gray-500');
      if (workbench.mappings?.coordinateColumns?.[physicalCol] !== undefined)
        td.classList.add('wb-coordinate-cell');
    },

    // Make HOT use defaultValues for validation if cell is empty
    beforeValidate: (
      value: any,
      _visualRow: number,
      property: number | string
    ) => {
      if (Boolean(value) || workbench.hot === undefined) return value;

      const visualCol = workbench.hot.propToCol(property);
      const physicalCol = workbench.hot.toPhysicalColumn(visualCol);

      return workbench.mappings?.defaultValues[physicalCol] ?? value;
    },

    afterValidate: (
      isValid,
      value: string | null = '',
      visualRow,
      property
    ) => {
      if (workbench.hot === undefined) return;
      const visualCol = workbench.hot.propToCol(property);

      const physicalRow = workbench.hot.toPhysicalRow(visualRow);
      const physicalCol = workbench.hot.toPhysicalColumn(visualCol);
      const issues = workbench.cells?.getCellMeta(
        physicalRow,
        physicalCol,
        'issues'
      );
      /*
       * Don't duplicate failedParsingPickList message if both front-end and
       * back-end identified the same issue.
       *
       * This is the only type of validation that is done on the front-end
       */
      const newIssues = f.unique([
        ...(isValid
          ? []
          : [
              whitespaceSensitive(
                backEndText.failedParsingPickList({
                  value: `"${value ?? 'null'}"`,
                })
              ),
            ]),
        ...issues!.filter(
          (issue) =>
            !issue.endsWith(
              whitespaceSensitive(
                backEndText.failedParsingPickList({ value: '' })
              )
            )
        ),
      ]);
      if (JSON.stringify(issues) !== JSON.stringify(newIssues))
        workbench.cells!.updateCellMeta(
          physicalRow,
          physicalCol,
          'issues',
          newIssues
        );
    },

    afterUndo: (data) => afterUndoRedoReact(workbench, 'undo', data),

    afterRedo: (data) => afterUndoRedoReact(workbench, 'redo', data),

    beforePaste: () =>
      // !wbView.uploadedView &&
      // !wbView.isUploaded &&
      hasPermission('/workbench/dataset', 'update'),

    /*
     * If copying values from a 1x3 area and pasting into the last cell, HOT
     * would create 2 invisible columns)
     *
     * This intercepts Paste to prevent creation of these columns
     *
     * This logic wasn't be put into beforePaste because it receives
     * arguments that are inconvenient to work with
     *
     */
    beforeChange: (unfilteredChanges, source) => {
      if (source !== 'CopyPaste.paste') return true;

      const filteredChanges = unfilteredChanges.filter(
        ([, property]) =>
          (property as number) < workbench.dataset.columns.length
      );
      if (
        filteredChanges.length === unfilteredChanges.length ||
        workbench.hot === undefined
      )
        return true;
      workbench.hot.setDataAtCell(
        filteredChanges.map(([visualRow, property, _oldValue, newValue]) => [
          visualRow,
          workbench.hot!.propToCol(property as number),
          newValue,
        ]),
        'CopyPaste.paste'
      );
      return false;
    },

    afterChange: (unfilteredChanges, source) => {
      if (
        ![
          'edit',
          'CopyPaste.paste',
          'CopyPaste.cut',
          'Autofill.fill',
          'UndoRedo.undo',
          'UndoRedo.redo',
        ].includes(source) ||
        !workbench.hot ||
        unfilteredChanges === null
      )
        return;
      const changes = unfilteredChanges
        .map(([visualRow, property, oldValue, newValue]) => ({
          visualRow,
          visualCol: workbench.hot!.propToCol(property),
          physicalRow: workbench.hot!.toPhysicalRow(visualRow),
          physicalCol:
            typeof property === 'number'
              ? property
              : workbench.hot!.toPhysicalColumn(
                  workbench.hot!.propToCol(property as number | string)
                ),
          oldValue,
          newValue,
        }))
        .filter(
          ({ oldValue, newValue, visualCol }) =>
            /*
             * Ignore cases where value didn't change
             * (happens when double click a cell and then click on another cell)
             *
             */
            oldValue !== newValue &&
            // Or where value changed from null to empty
            (oldValue !== null || newValue !== '') &&
            // Or the column does not exist (that can happen on paste)
            visualCol < workbench.dataset.columns.length
        );

      if (changes.length === 0) return;

      const changedRows = new Set(
        changes
          // Ignore changes to unmapped columns
          .filter(
            ({ physicalCol }) => physicalColToMappingCol(physicalCol) !== -1
          )
          .sort(sortFunction(({ visualRow }) => visualRow))
          .map(({ physicalRow }) => physicalRow)
      );

      /*
       * Don't clear disambiguation when afterChange is triggered by
       * wbView.hot.undo() from inside of wbView.afterUndoRedo()
       * FEATURE: consider not clearing disambiguation at all
       */
      // if (!wbView.undoRedoIsHandled)
      //   changedRows.forEach((physicalRow) =>
      //     workbench.disambiguation?.clearDisambiguation(physicalRow)
      //   );

      changes.forEach(
        ({
          visualRow,
          visualCol,
          physicalRow,
          physicalCol,
          oldValue = '',
          newValue,
        }) => {
          if (
            workbench.cells?.getCellMeta(
              physicalRow,
              physicalCol,
              'originalValue'
            ) === undefined
          )
            workbench.cells?.setCellMeta(
              physicalRow,
              physicalCol,
              'originalValue',
              oldValue
            );
          workbench.cells?.recalculateIsModifiedState(
            physicalRow,
            physicalCol,
            {
              visualRow,
              visualCol,
            }
          );
          if (
            workbench.utils?.searchPreferences.search.liveUpdate &&
            workbench.utils?.searchQuery !== undefined
          )
            workbench.cells?.updateCellMeta(
              physicalRow,
              physicalCol,
              'isSearchResult',
              workbench.utils?.searchFunction(newValue),
              { visualRow, visualCol }
            );
        }
      );

      spreadsheetChanged();
      workbench.cells?.updateCellInfoStats();

      if (workbench.dataset.uploadplan)
        changedRows.forEach((physicalRow) =>
          workbench.validation?.startValidateRow(physicalRow)
        );
    },

    /*
     * This may be called before full initialization of the workbench because
     * of the minSpareRows setting in HOT. Thus, be sure to check if
     * wbView.hotIsReady is true
     *
     * Also, I don't think this is ever called with amount > 1.
     * Even if multiple new rows where created at once (e.x on paste), HOT calls
     * this hook one row at a time
     *
     * Also, this function needs to be called before afterValidate, thus I used
     * beforeCreateRow, instead of afterCreateRow
     *
     */
    beforeCreateRow: (visualRowStart, amount, source) => {
      const addedRows = Array.from(
        { length: amount },
        (_, index) =>
          /*
           * If HOT is not yet fully initialized, we can assume that physical row
           * order and visual row order is the same
           */
          workbench.hot?.toPhysicalRow(visualRowStart + index) ??
          visualRowStart + index
        // REFACTOR: use sortFunction here
      ).sort();

      workbench.cells!.flushIndexedCellData = true;
      addedRows
        .filter((physicalRow) => physicalRow < workbench.cells!.cellMeta.length)
        .forEach((physicalRow) =>
          workbench.cells?.cellMeta.splice(physicalRow, 0, [])
        );
      if (workbench.hot && source !== 'auto') spreadsheetChanged();

      return true;
    },

    beforeRemoveRow: (visualRowStart, amount, _, source) => {
      if (workbench.hot === undefined) return;
      // Get indexes of removed rows in reverse order
      const removedRows = Array.from({ length: amount }, (_, index) =>
        workbench.hot!.toPhysicalRow(visualRowStart + index)
      )
        .filter((physicalRow) => physicalRow < workbench.cells!.cellMeta.length)
        // REFACTOR: use sortFunction here
        .sort()
        .reverse();

      removedRows.forEach((physicalRow) => {
        workbench.cells!.cellMeta.splice(physicalRow, 1);
        workbench.validation!.liveValidationStack.splice(physicalRow, 1);
      });

      workbench.cells!.flushIndexedCellData = true;

      if (workbench.hot && source !== 'auto') {
        spreadsheetChanged();
        workbench.cells!.updateCellInfoStats();
      }

      return true;
    },

    /*
     * If a tree column is about to be sorted, overwrite the sort config by
     * finding all lower level ranks of that tree (within the same -to-many)
     * and sorting them in the same direction
     */
    beforeColumnSort: (currentSortConfig, newSortConfig) => {
      workbench.cells!.flushIndexedCellData = true;

      // if (wbView.coordinateConverterView) return false;

      if (
        workbench.mappings === undefined ||
        sortConfigIsSet ||
        workbench.hot === undefined
      )
        return true;

      const findTreeColumns = (
        sortConfig: RA<Handsontable.plugins.ColumnSorting.Config>,
        deltaSearchConfig: RA<Handsontable.plugins.ColumnSorting.Config>
      ) =>
        sortConfig
          .map(({ column: visualCol, sortOrder }) => ({
            sortOrder,
            visualCol,
            physicalCol: workbench.hot!.toPhysicalColumn(visualCol),
          }))
          .map(({ physicalCol, ...rest }) => ({
            ...rest,
            rankGroup: workbench
              .mappings!.treeRanks?.map((rankGroup, groupIndex) => ({
                rankId: rankGroup.find(
                  (mapping) => mapping.physicalCol === physicalCol
                )?.rankId,
                groupIndex,
              }))
              .find(({ rankId }) => rankId !== undefined),
          }))
          // Filter out columns that aren't tree ranks
          .filter(({ rankGroup }) => rankGroup !== undefined)
          /*
           * Filter out columns that didn't change
           * In the end, there should only be 0 or 1 columns
           *
           */
          .find(({ sortOrder, visualCol }) => {
            const deltaColumnState = deltaSearchConfig.find(
              ({ column }) => column === visualCol
            );
            return (
              deltaColumnState === undefined ||
              deltaColumnState.sortOrder !== sortOrder
            );
          });

      let changedTreeColumn = findTreeColumns(newSortConfig, currentSortConfig);
      let newSortOrderIsUnset = false;

      if (changedTreeColumn === undefined) {
        changedTreeColumn = findTreeColumns(currentSortConfig, newSortConfig);
        newSortOrderIsUnset = true;
      }

      if (changedTreeColumn === undefined) return true;

      /*
       * Filter out columns with higher rank than the changed column
       * (lower rankId corresponds to a higher tree rank)
       *
       */
      const columnsToSort = workbench.mappings.treeRanks[
        changedTreeColumn.rankGroup!.groupIndex
      ]
        .filter(({ rankId }) => rankId >= changedTreeColumn!.rankGroup!.rankId!)
        .map(({ physicalCol }) => workbench.hot!.toVisualColumn(physicalCol));

      // Filter out columns that are about to be sorted
      const partialSortConfig = newSortConfig.filter(
        ({ column }) => !columnsToSort.includes(column)
      );

      const fullSortConfig = [
        ...partialSortConfig,
        ...(newSortOrderIsUnset
          ? []
          : columnsToSort.map((visualCol) => ({
              column: visualCol,
              sortOrder: changedTreeColumn!.sortOrder,
            }))),
      ];

      sortConfigIsSet = true;
      getHotPlugin(workbench.hot, 'multiColumnSorting').sort(fullSortConfig);
      sortConfigIsSet = false;

      return false;
    },

    // Cache sort config to preserve column sort order across sessions
    afterColumnSort: async (_previousSortConfig, sortConfig) => {
      if (workbench.hot === undefined) return;
      const physicalSortConfig = sortConfig.map((rest) => ({
        ...rest,
        physicalCol: workbench.hot!.toPhysicalColumn(rest.column),
      }));
      setCache(
        'workBenchSortConfig',
        `${schema.domainLevelIds.collection}_${workbench.dataset.id}`,
        physicalSortConfig
      );
    },

    beforeColumnMove: (_columnIndexes, _finalIndex, dropIndex) =>
      // Don't allow moving columns when isReadOnly
      // !wbView.uploadedView &&
      // !wbView.coordinateConverterView &&
      // An ugly fix for jQuery's dialogs conflicting with HOT
      dropIndex !== undefined || !workbench.hot,

    // Save new visualOrder on the back end
    afterColumnMove: (_columnIndexes, _finalIndex, dropIndex) => {
      // An ugly fix for jQuery's dialogs conflicting with HOT
      if (dropIndex === undefined || !workbench.hot) return;

      workbench.cells!.flushIndexedCellData = true;

      const columnOrder = workbench.dataset.columns.map((_, visualCol) =>
        workbench.hot!.toPhysicalColumn(visualCol)
      );

      if (
        workbench.dataset.visualorder === null ||
        columnOrder.some(
          (i, index) => i !== workbench.dataset.visualorder![index]
        )
      ) {
        overwriteReadOnly(workbench.dataset, 'visualorder', columnOrder);
        ping(`/api/workbench/dataset/${workbench.dataset.id}/`, {
          method: 'PUT',
          body: { visualorder: columnOrder },
          expectedErrors: [Http.NOT_FOUND],
        }).then((status) => checkDeletedFail(status));
      }
    },

    // Do not scroll the viewport to the last column after inserting a row
    afterPaste: (data, coords) => {
      const lastCoords = coords.at(-1);
      if (
        typeof lastCoords === 'object' &&
        data.some((row) => row.length === workbench.dataset.columns.length) &&
        workbench.hot !== undefined
      )
        workbench.hot.scrollViewportTo(lastCoords.endRow, lastCoords.startCol);
    },

    /*
     * Reposition the comment box if it is overflowing
     * See https://github.com/specify/specify7/issues/932
     * REFACTOR: https://github.com/specify/specify7/issues/1925
     */
    afterOnCellMouseOver: (_event, coordinates, cell) => {
      if (workbench.hot === undefined) return;
      const physicalRow = workbench.hot.toPhysicalRow(coordinates.row);
      const physicalCol = workbench.hot.toPhysicalColumn(coordinates.col);

      // Make sure cell has comments
      if (
        workbench.cells!.getCellMeta(physicalRow, physicalCol, 'issues')
          .length === 0
      )
        return;

      const cellContainerBoundingBox = cell.getBoundingClientRect();

      // Make sure box is overflowing horizontally
      if (globalThis.innerWidth > cellContainerBoundingBox.right + oneRem * 2)
        return;

      // wbView.hotCommentsContainer?.style.setProperty(
      //   '--offset-right',
      //   `${Math.round(globalThis.innerWidth - cellContainerBoundingBox.x)}px`
      // );
      // wbView.hotCommentsContainer?.classList.add(
      //   'right-[var(--offset-right)]',
      //   '!left-[unset]'
      // );
      if (hotCommentsContainerRepositionTimeout) {
        globalThis.clearTimeout(hotCommentsContainerRepositionTimeout);
        hotCommentsContainerRepositionTimeout = undefined;
      }
    },

    /*
     * Revert comment box's position to original state if needed.
     * The 10ms delay helps prevent visual artifacts when the mouse pointer
     * moves between cells.
     */
    afterOnCellMouseOut: () => {
      // if (hotCommentsContainerRepositionTimeout)
      //   globalThis.clearTimeout(hotCommentsContainerRepositionTimeout);
      // if (
      //   wbView.hotCommentsContainer?.style.getPropertyValue(
      //     '--offset-right'
      //   ) !== ''
      // )
      //   hotCommentsContainerRepositionTimeout = globalThis.setTimeout(
      //     () =>
      //       wbView.hotCommentsContainer?.classList.remove(
      //         'right-[var(--offset-right)]',
      //         '!left-[unset]'
      //       ),
      //     10
      //   );
    },

    /*
     * Disallow user from selecting several times the same cell
     */
    afterSelection: () => {
      if (workbench.hot === undefined) return;
      const selection = workbench.hot?.getSelected() ?? [];
      const newSelection = f
        .unique(selection.map((row) => JSON.stringify(row)))
        .map((row) => JSON.parse(row));
      if (newSelection.length !== selection.length) {
        workbench.hot?.deselectCell();
        workbench.hot?.selectCells(newSelection);
      }
    },
  });
}

/**
 * Any change to a row clears disambiguation results
 * Clearing disambiguation creates a separate point in the undo/redo stack
 * This runs undo twice when undoing a change that caused disambiguation
 * clear and similarly redoes the change twice
 *
 */
function afterUndoRedoReact(
  workbench: Workbench,
  type: 'redo' | 'undo',
  data: Action
): void {
  if (
    // workbench.undoRedoIsHandled ||
    data.actionType !== 'change' ||
    data.changes.length !== 1 ||
    workbench.hot === undefined
  )
    return;

  const [visualRow, visualCol, newData, oldData] = data.changes[0];
  const physicalRow = workbench.hot.toPhysicalRow(visualRow);
  const physicalCol = workbench.hot.toPhysicalColumn(visualCol as number);
  if (physicalCol !== workbench.dataset.columns.length) return;

  const newValue = JSON.parse(newData || '{}').disambiguation;
  const oldValue = JSON.parse(oldData || '{}').disambiguation;

  /*
   * Disambiguation results are cleared when any cell in a row changes.
   * That change creates a separate point in the undo stack.
   * Thus, if HOT tries to undo disambiguation clearing, we need to
   * also need to undo the change that caused disambiguation clearing
   */
  if (
    type === 'undo' &&
    Object.keys(newValue ?? {}).length > 0 &&
    Object.keys(oldValue ?? {}).length === 0
  )
    // HOT doesn't seem to like calling undo from inside of afterUndo
    globalThis.setTimeout(() => {
      // wbView.undoRedoIsHandled = true;
      workbench.hot?.undo();
      // wbView.undoRedoIsHandled = false;
      workbench.disambiguation!.afterChangeDisambiguation(physicalRow);
    }, 0);
  else workbench.disambiguation!.afterChangeDisambiguation(physicalRow);
}

export function getHotHooks(wbView: WbView) {
  let sortConfigIsSet: boolean = false;
  let hotCommentsContainerRepositionTimeout:
    | ReturnType<typeof setTimeout>
    | undefined = undefined;

  return ensure<Partial<Events>>()({
    /*
     * After cell is rendered, we need to reApply metaData classes
     * NOTE:
     * .issues are handled automatically by the comments plugin.
     * This is why, afterRenderer only has to handle the isModified and isNew
     * cases
     *
     */
    afterRenderer: (
      td: any,
      visualRow: number,
      visualCol: number,
      property: number | string,
      _value: string
    ) => {
      if (wbView.hot === undefined) {
        td.classList.add('text-gray-500');
        return;
      }
      const physicalRow = wbView.hot.toPhysicalRow(visualRow);
      const physicalCol =
        typeof property === 'number'
          ? property
          : wbView.hot.toPhysicalColumn(visualCol);
      if (physicalCol >= wbView.dataset.columns.length) return;
      const metaArray = wbView.cells.cellMeta?.[physicalRow]?.[physicalCol];
      if (wbView.cells.getCellMetaFromArray(metaArray, 'isModified'))
        wbView.cells.runMetaUpdateEffects(
          td,
          'isModified',
          true,
          visualRow,
          visualCol
        );
      if (wbView.cells.getCellMetaFromArray(metaArray, 'isNew'))
        wbView.cells.runMetaUpdateEffects(
          td,
          'isNew',
          true,
          visualRow,
          visualCol
        );
      if (wbView.cells.getCellMetaFromArray(metaArray, 'isSearchResult'))
        wbView.cells.runMetaUpdateEffects(
          td,
          'isSearchResult',
          true,
          visualRow,
          visualCol
        );
      if (wbView.mappings?.mappedHeaders?.[physicalCol] === undefined)
        td.classList.add('text-gray-500');
      if (wbView.mappings?.coordinateColumns?.[physicalCol] !== undefined)
        td.classList.add('wb-coordinate-cell');
    },

    // Make HOT use defaultValues for validation if cell is empty
    beforeValidate: (
      value: any,
      _visualRow: number,
      property: number | string
    ) => {
      if (Boolean(value) || wbView.hot === undefined) return value;

      const visualCol = wbView.hot.propToCol(property);
      const physicalCol = wbView.hot.toPhysicalColumn(visualCol);

      return wbView.mappings?.defaultValues[physicalCol] ?? value;
    },

    afterValidate: (
      isValid,
      value: string | null = '',
      visualRow,
      property
    ) => {
      if (wbView.hot === undefined) return;
      const visualCol = wbView.hot.propToCol(property);

      const physicalRow = wbView.hot.toPhysicalRow(visualRow);
      const physicalCol = wbView.hot.toPhysicalColumn(visualCol);
      const issues = wbView.cells.getCellMeta(
        physicalRow,
        physicalCol,
        'issues'
      );
      /*
       * Don't duplicate failedParsingPickList message if both front-end and
       * back-end identified the same issue.
       *
       * This is the only type of validation that is done on the front-end
       */
      const newIssues = f.unique([
        ...(isValid
          ? []
          : [
              whitespaceSensitive(
                backEndText.failedParsingPickList({
                  value: `"${value ?? 'null'}"`,
                })
              ),
            ]),
        ...issues.filter(
          (issue) =>
            !issue.endsWith(
              whitespaceSensitive(
                backEndText.failedParsingPickList({ value: '' })
              )
            )
        ),
      ]);
      if (JSON.stringify(issues) !== JSON.stringify(newIssues))
        wbView.cells.updateCellMeta(
          physicalRow,
          physicalCol,
          'issues',
          newIssues
        );
    },

    afterUndo: (data) => afterUndoRedo(wbView, 'undo', data),

    afterRedo: (data) => afterUndoRedo(wbView, 'redo', data),

    beforePaste: () =>
      !wbView.uploadedView &&
      !wbView.isUploaded &&
      hasPermission('/workbench/dataset', 'update'),

    /*
     * If copying values from a 1x3 area and pasting into the last cell, HOT
     * would create 2 invisible columns)
     *
     * This intercepts Paste to prevent creation of these columns
     *
     * This logic wasn't be put into beforePaste because it receives
     * arguments that are inconvenient to work with
     *
     */
    beforeChange: (unfilteredChanges, source) => {
      if (source !== 'CopyPaste.paste') return true;

      const filteredChanges = unfilteredChanges.filter(
        ([, property]) => (property as number) < wbView.dataset.columns.length
      );
      if (
        filteredChanges.length === unfilteredChanges.length ||
        wbView.hot === undefined
      )
        return true;
      wbView.hot.setDataAtCell(
        filteredChanges.map(([visualRow, property, _oldValue, newValue]) => [
          visualRow,
          wbView.hot!.propToCol(property as number),
          newValue,
        ]),
        'CopyPaste.paste'
      );
      return false;
    },

    afterChange: (unfilteredChanges, source) => {
      if (
        ![
          'edit',
          'CopyPaste.paste',
          'CopyPaste.cut',
          'Autofill.fill',
          'UndoRedo.undo',
          'UndoRedo.redo',
        ].includes(source) ||
        wbView.hot === undefined ||
        unfilteredChanges === null
      )
        return;

      const changes = unfilteredChanges
        .map(([visualRow, property, oldValue, newValue]) => ({
          visualRow,
          visualCol: wbView.hot!.propToCol(property),
          physicalRow: wbView.hot!.toPhysicalRow(visualRow),
          physicalCol:
            typeof property === 'number'
              ? property
              : wbView.hot!.toPhysicalColumn(
                  wbView.hot!.propToCol(property as number | string)
                ),
          oldValue,
          newValue,
        }))
        .filter(
          ({ oldValue, newValue, visualCol }) =>
            /*
             * Ignore cases where value didn't change
             * (happens when double click a cell and then click on another cell)
             *
             */
            oldValue !== newValue &&
            // Or where value changed from null to empty
            (oldValue !== null || newValue !== '') &&
            // Or the column does not exist (that can happen on paste)
            visualCol < wbView.dataset.columns.length
        );

      if (changes.length === 0) return;

      const changedRows = new Set(
        changes
          // Ignore changes to unmapped columns
          .filter(
            ({ physicalCol }) =>
              wbView.physicalColToMappingCol(physicalCol) !== -1
          )
          .sort(sortFunction(({ visualRow }) => visualRow))
          .map(({ physicalRow }) => physicalRow)
      );

      /*
       * Don't clear disambiguation when afterChange is triggered by
       * wbView.hot.undo() from inside of wbView.afterUndoRedo()
       * FEATURE: consider not clearing disambiguation at all
       */
      if (!wbView.undoRedoIsHandled)
        changedRows.forEach((physicalRow) =>
          wbView.disambiguation.clearDisambiguation(physicalRow)
        );

      changes.forEach(
        ({
          visualRow,
          visualCol,
          physicalRow,
          physicalCol,
          oldValue = '',
          newValue,
        }) => {
          if (
            wbView.cells.getCellMeta(
              physicalRow,
              physicalCol,
              'originalValue'
            ) === undefined
          )
            wbView.cells.setCellMeta(
              physicalRow,
              physicalCol,
              'originalValue',
              oldValue
            );
          wbView.cells.recalculateIsModifiedState(physicalRow, physicalCol, {
            visualRow,
            visualCol,
          });
          if (
            wbView.wbUtils.searchPreferences.search.liveUpdate &&
            wbView.wbUtils.searchQuery !== undefined
          )
            wbView.cells.updateCellMeta(
              physicalRow,
              physicalCol,
              'isSearchResult',
              wbView.wbUtils.searchFunction(newValue),
              { visualRow, visualCol }
            );
        }
      );

      wbView.actions.spreadSheetChanged();
      wbView.cells.updateCellInfoStats();

      if (wbView.dataset.uploadplan)
        changedRows.forEach((physicalRow) =>
          wbView.validation.startValidateRow(physicalRow)
        );
    },

    /*
     * This may be called before full initialization of the workbench because
     * of the minSpareRows setting in HOT. Thus, be sure to check if
     * wbView.hotIsReady is true
     *
     * Also, I don't think this is ever called with amount > 1.
     * Even if multiple new rows where created at once (e.x on paste), HOT calls
     * this hook one row at a time
     *
     * Also, this function needs to be called before afterValidate, thus I used
     * beforeCreateRow, instead of afterCreateRow
     *
     */
    beforeCreateRow: (visualRowStart, amount, source) => {
      const addedRows = Array.from(
        { length: amount },
        (_, index) =>
          /*
           * If HOT is not yet fully initialized, we can assume that physical row
           * order and visual row order is the same
           */
          wbView.hot?.toPhysicalRow(visualRowStart + index) ??
          visualRowStart + index
        // REFACTOR: use sortFunction here
      ).sort();

      wbView.cells.flushIndexedCellData = true;
      addedRows
        .filter((physicalRow) => physicalRow < wbView.cells.cellMeta.length)
        .forEach((physicalRow) =>
          wbView.cells.cellMeta.splice(physicalRow, 0, [])
        );
      if (wbView.hotIsReady && source !== 'auto')
        wbView.actions.spreadSheetChanged();

      return true;
    },

    beforeRemoveRow: (visualRowStart, amount, _, source) => {
      if (wbView.hot === undefined) return;
      // Get indexes of removed rows in reverse order
      const removedRows = Array.from({ length: amount }, (_, index) =>
        wbView.hot!.toPhysicalRow(visualRowStart + index)
      )
        .filter((physicalRow) => physicalRow < wbView.cells.cellMeta.length)
        // REFACTOR: use sortFunction here
        .sort()
        .reverse();

      removedRows.forEach((physicalRow) => {
        wbView.cells.cellMeta.splice(physicalRow, 1);
        wbView.validation.liveValidationStack.splice(physicalRow, 1);
      });

      wbView.cells.flushIndexedCellData = true;

      if (wbView.hotIsReady && source !== 'auto') {
        wbView.actions.spreadSheetChanged();
        wbView.cells.updateCellInfoStats();
      }

      return true;
    },

    /*
     * If a tree column is about to be sorted, overwrite the sort config by
     * finding all lower level ranks of that tree (within the same -to-many)
     * and sorting them in the same direction
     */
    beforeColumnSort: (currentSortConfig, newSortConfig) => {
      wbView.cells.flushIndexedCellData = true;

      if (wbView.coordinateConverterView) return false;

      if (
        wbView.mappings === undefined ||
        sortConfigIsSet ||
        wbView.hot === undefined
      )
        return true;

      const findTreeColumns = (
        sortConfig: RA<Handsontable.plugins.ColumnSorting.Config>,
        deltaSearchConfig: RA<Handsontable.plugins.ColumnSorting.Config>
      ) =>
        sortConfig
          .map(({ column: visualCol, sortOrder }) => ({
            sortOrder,
            visualCol,
            physicalCol: wbView.hot!.toPhysicalColumn(visualCol),
          }))
          .map(({ physicalCol, ...rest }) => ({
            ...rest,
            rankGroup: wbView
              .mappings!.treeRanks?.map((rankGroup, groupIndex) => ({
                rankId: rankGroup.find(
                  (mapping) => mapping.physicalCol === physicalCol
                )?.rankId,
                groupIndex,
              }))
              .find(({ rankId }) => rankId !== undefined),
          }))
          // Filter out columns that aren't tree ranks
          .filter(({ rankGroup }) => rankGroup !== undefined)
          /*
           * Filter out columns that didn't change
           * In the end, there should only be 0 or 1 columns
           *
           */
          .find(({ sortOrder, visualCol }) => {
            const deltaColumnState = deltaSearchConfig.find(
              ({ column }) => column === visualCol
            );
            return (
              deltaColumnState === undefined ||
              deltaColumnState.sortOrder !== sortOrder
            );
          });

      let changedTreeColumn = findTreeColumns(newSortConfig, currentSortConfig);
      let newSortOrderIsUnset = false;

      if (changedTreeColumn === undefined) {
        changedTreeColumn = findTreeColumns(currentSortConfig, newSortConfig);
        newSortOrderIsUnset = true;
      }

      if (changedTreeColumn === undefined) return true;

      /*
       * Filter out columns with higher rank than the changed column
       * (lower rankId corresponds to a higher tree rank)
       *
       */
      const columnsToSort = wbView.mappings.treeRanks[
        changedTreeColumn.rankGroup!.groupIndex
      ]
        .filter(({ rankId }) => rankId >= changedTreeColumn!.rankGroup!.rankId!)
        .map(({ physicalCol }) => wbView.hot!.toVisualColumn(physicalCol));

      // Filter out columns that are about to be sorted
      const partialSortConfig = newSortConfig.filter(
        ({ column }) => !columnsToSort.includes(column)
      );

      const fullSortConfig = [
        ...partialSortConfig,
        ...(newSortOrderIsUnset
          ? []
          : columnsToSort.map((visualCol) => ({
              column: visualCol,
              sortOrder: changedTreeColumn!.sortOrder,
            }))),
      ];

      sortConfigIsSet = true;
      getHotPlugin(wbView.hot, 'multiColumnSorting').sort(fullSortConfig);
      sortConfigIsSet = false;

      return false;
    },

    // Cache sort config to preserve column sort order across sessions
    afterColumnSort: async (_previousSortConfig, sortConfig) => {
      if (wbView.hot === undefined) return;
      const physicalSortConfig = sortConfig.map((rest) => ({
        ...rest,
        physicalCol: wbView.hot!.toPhysicalColumn(rest.column),
      }));
      setCache(
        'workBenchSortConfig',
        `${schema.domainLevelIds.collection}_${wbView.dataset.id}`,
        physicalSortConfig
      );
    },

    beforeColumnMove: (_columnIndexes, _finalIndex, dropIndex) =>
      // Don't allow moving columns when isReadOnly
      !wbView.uploadedView &&
      !wbView.coordinateConverterView &&
      // An ugly fix for jQuery's dialogs conflicting with HOT
      (dropIndex !== undefined || !wbView.hotIsReady),

    // Save new visualOrder on the back end
    afterColumnMove: (_columnIndexes, _finalIndex, dropIndex) => {
      // An ugly fix for jQuery's dialogs conflicting with HOT
      if (
        dropIndex === undefined ||
        !wbView.hotIsReady ||
        wbView.hot === undefined
      )
        return;

      wbView.cells.flushIndexedCellData = true;

      const columnOrder = wbView.dataset.columns.map((_, visualCol) =>
        wbView.hot!.toPhysicalColumn(visualCol)
      );

      if (
        wbView.dataset.visualorder === null ||
        columnOrder.some((i, index) => i !== wbView.dataset.visualorder![index])
      ) {
        overwriteReadOnly(wbView.dataset, 'visualorder', columnOrder);
        ping(`/api/workbench/dataset/${wbView.dataset.id}/`, {
          method: 'PUT',
          body: { visualorder: columnOrder },
          expectedErrors: [Http.NOT_FOUND],
        }).then(wbView.checkDeletedFail.bind(wbView));
      }
    },

    // Do not scroll the viewport to the last column after inserting a row
    afterPaste: (data, coords) => {
      const lastCoords = coords.at(-1);
      if (
        typeof lastCoords === 'object' &&
        data.some((row) => row.length === wbView.dataset.columns.length) &&
        wbView.hot !== undefined
      )
        wbView.hot.scrollViewportTo(lastCoords.endRow, lastCoords.startCol);
    },

    /*
     * Reposition the comment box if it is overflowing
     * See https://github.com/specify/specify7/issues/932
     * REFACTOR: https://github.com/specify/specify7/issues/1925
     */
    afterOnCellMouseOver: (_event, coordinates, cell) => {
      if (wbView.hot === undefined) return;
      const physicalRow = wbView.hot.toPhysicalRow(coordinates.row);
      const physicalCol = wbView.hot.toPhysicalColumn(coordinates.col);

      // Make sure cell has comments
      if (
        wbView.cells.getCellMeta(physicalRow, physicalCol, 'issues').length ===
        0
      )
        return;

      const cellContainerBoundingBox = cell.getBoundingClientRect();

      // Make sure box is overflowing horizontally
      if (globalThis.innerWidth > cellContainerBoundingBox.right + oneRem * 2)
        return;

      wbView.hotCommentsContainer?.style.setProperty(
        '--offset-right',
        `${Math.round(globalThis.innerWidth - cellContainerBoundingBox.x)}px`
      );
      wbView.hotCommentsContainer?.classList.add(
        'right-[var(--offset-right)]',
        '!left-[unset]'
      );
      if (hotCommentsContainerRepositionTimeout) {
        globalThis.clearTimeout(hotCommentsContainerRepositionTimeout);
        hotCommentsContainerRepositionTimeout = undefined;
      }
    },

    /*
     * Revert comment box's position to original state if needed.
     * The 10ms delay helps prevent visual artifacts when the mouse pointer
     * moves between cells.
     */
    afterOnCellMouseOut: () => {
      if (hotCommentsContainerRepositionTimeout)
        globalThis.clearTimeout(hotCommentsContainerRepositionTimeout);
      if (
        wbView.hotCommentsContainer?.style.getPropertyValue(
          '--offset-right'
        ) !== ''
      )
        hotCommentsContainerRepositionTimeout = globalThis.setTimeout(
          () =>
            wbView.hotCommentsContainer?.classList.remove(
              'right-[var(--offset-right)]',
              '!left-[unset]'
            ),
          10
        );
    },

    /*
     * Disallow user from selecting several times the same cell
     */
    afterSelection: () => {
      if (wbView.hot === undefined) return;
      const selection = wbView.hot?.getSelected() ?? [];
      const newSelection = f
        .unique(selection.map((row) => JSON.stringify(row)))
        .map((row) => JSON.parse(row));
      if (newSelection.length !== selection.length) {
        wbView.hot?.deselectCell();
        wbView.hot?.selectCells(newSelection);
      }
    },
  });
}

/**
 * Any change to a row clears disambiguation results
 * Clearing disambiguation creates a separate point in the undo/redo stack
 * This runs undo twice when undoing a change that caused disambiguation
 * clear and similarly redoes the change twice
 *
 */
function afterUndoRedo(
  wbView: WbView,
  type: 'redo' | 'undo',
  data: Action
): void {
  if (
    wbView.undoRedoIsHandled ||
    data.actionType !== 'change' ||
    data.changes.length !== 1 ||
    wbView.hot === undefined
  )
    return;

  const [visualRow, visualCol, newData, oldData] = data.changes[0];
  const physicalRow = wbView.hot.toPhysicalRow(visualRow);
  const physicalCol = wbView.hot.toPhysicalColumn(visualCol as number);
  if (physicalCol !== wbView.dataset.columns.length) return;

  const newValue = JSON.parse(newData || '{}').disambiguation;
  const oldValue = JSON.parse(oldData || '{}').disambiguation;

  /*
   * Disambiguation results are cleared when any cell in a row changes.
   * That change creates a separate point in the undo stack.
   * Thus, if HOT tries to undo disambiguation clearing, we need to
   * also need to undo the change that caused disambiguation clearing
   */
  if (
    type === 'undo' &&
    Object.keys(newValue ?? {}).length > 0 &&
    Object.keys(oldValue ?? {}).length === 0
  )
    // HOT doesn't seem to like calling undo from inside of afterUndo
    globalThis.setTimeout(() => {
      wbView.undoRedoIsHandled = true;
      wbView.hot?.undo();
      wbView.undoRedoIsHandled = false;
      wbView.disambiguation.afterChangeDisambiguation(physicalRow);
    }, 0);
  else wbView.disambiguation.afterChangeDisambiguation(physicalRow);
}
