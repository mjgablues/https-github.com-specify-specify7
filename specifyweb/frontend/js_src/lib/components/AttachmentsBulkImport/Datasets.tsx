import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAsyncState, usePromise } from '../../hooks/useAsyncState';
import { useBooleanState } from '../../hooks/useBooleanState';
import { attachmentsText } from '../../localization/attachments';
import { commonText } from '../../localization/common';
import { wbText } from '../../localization/workbench';
import { ajax } from '../../utils/ajax';
import type { RA } from '../../utils/types';
import { Button } from '../Atoms/Button';
import { Link } from '../Atoms/Link';
import { strictGetModel } from '../DataModel/schema';
import { DateElement } from '../Molecules/DateElement';
import { Dialog } from '../Molecules/Dialog';
import { SortIndicator, useSortConfig } from '../Molecules/Sorting';
import { hasPermission } from '../Permissions/helpers';
import { OverlayContext } from '../Router/Router';
import { createEmptyDataSet } from '../Toolbar/WbsDialog';
import { blueTable } from '../WorkBench/DataSetMeta';
import { AttachmentDatasetMeta } from './RenameDataSet';
import type {
  AttachmentDataSet,
  AttachmentDatasetBrief,
  FetchedDataSet,
} from './types';
import { useEagerDataSet } from './useEagerDataset';

const fetchAttachmentMappings = async () =>
  ajax<RA<AttachmentDatasetBrief>>(`/attachment_gw/dataset/`, {
    headers: { Accept: 'application/json' },
    method: 'GET',
  }).then(({ data }) => data);

function ModifyDatasetWrapped({
  id,
  onClose: handleClose,
}: {
  readonly id: number;
  readonly onClose: () => void;
}): JSX.Element | null {
  const [rawDataset] = useAsyncState(
    React.useCallback(
      async () =>
        ajax<FetchedDataSet>(`/attachment_gw/dataset/${id}/`, {
          headers: { Accept: 'application/json' },
          method: 'GET',
        }).then(({ data }) => data),
      [id]
    ),
    true
  );
  return rawDataset === undefined ? null : (
    <ModifyDataset dataset={rawDataset} onClose={handleClose} />
  );
}

function ModifyDataset({
  dataset,
  onClose: handleClose,
}: {
  readonly dataset: FetchedDataSet;
  readonly onClose: () => void;
}): JSX.Element {
  const { eagerDataSet, triggerSave, commitChange } = useEagerDataSet(dataset);
  const [triedToSave, handleTriedToSave] = useBooleanState();

  React.useLayoutEffect(() => {
    if (triedToSave && !eagerDataSet.needsSaved) handleClose();
  }, [eagerDataSet.needsSaved, triedToSave]);

  return (
    <AttachmentDatasetMeta
      dataset={eagerDataSet}
      onChange={(props) => {
        commitChange((oldState) => ({
          ...oldState,
          uploaderstatus: dataset.uploaderstatus,
          ...props,
        }));
        triggerSave();
        handleTriedToSave();
      }}
      onClose={handleClose}
    />
  );
}

const createEmpty = async () =>
  createEmptyDataSet<AttachmentDataSet>(
    '/attachment_gw/dataset/',
    attachmentsText.newAttachmentDataset({ date: new Date().toDateString() }),
    {
      uploadplan: { staticPathKey: undefined },
      uploaderstatus: 'main',
    }
  );

export function AttachmentsImportOverlay(): JSX.Element | null {
  const handleClose = React.useContext(OverlayContext);
  const navigate = useNavigate();
  const attachmentDataSetsPromise = React.useMemo(fetchAttachmentMappings, []);
  const [unsortedDatasets] = usePromise(attachmentDataSetsPromise, true);
  const [sortConfig, handleSort, applySortConfig] = useSortConfig(
    'attachmentDatasets',
    'timestampCreated'
  );
  const sortedDatasets = React.useMemo(
    () =>
      unsortedDatasets === undefined
        ? undefined
        : applySortConfig(unsortedDatasets, (dataset) =>
            sortConfig.sortField === 'timestampCreated'
              ? dataset.timestampcreated
              : sortConfig.sortField === 'timestampModified'
              ? dataset.timestampmodified
              : dataset.name
          ),
    [unsortedDatasets, applySortConfig, sortConfig]
  );
  const [editing, setEditing] = React.useState<number | undefined>(undefined);

  return sortedDatasets === undefined ? null : (
    <>
      {typeof editing === 'number' && (
        <ModifyDatasetWrapped id={editing} onClose={handleClose} />
      )}
      <Dialog
        buttons={
          <>
            <Button.DialogClose>{commonText.close()}</Button.DialogClose>
            {hasPermission('/attachment_import/dataset', 'create') && (
              <Button.Info
                onClick={async () =>
                  createEmpty().then(({ id }) =>
                    navigate(`/specify/attachments/import/${id}`)
                  )
                }
              >
                {commonText.new()}
              </Button.Info>
            )}
          </>
        }
        header={attachmentsText.attachmentImportDatasetsCount({
          count: sortedDatasets.length,
        })}
        icon={blueTable}
        onClose={handleClose}
      >
        <table className="grid-table grid-cols-[repeat(3,auto)_min-content] gap-2">
          <thead>
            <tr>
              <th scope="col">
                <Button.LikeLink onClick={() => handleSort('name')}>
                  {wbText.dataSetName()}
                </Button.LikeLink>
                <SortIndicator fieldName="name" sortConfig={sortConfig} />
              </th>

              <th scope="col" onClick={() => handleSort('timestampCreated')}>
                <Button.LikeLink
                  onClick={() => handleSort('timestampModified')}
                >
                  {
                    strictGetModel('WorkBench').strictGetField(
                      'timestampCreated'
                    ).label
                  }
                </Button.LikeLink>
                <SortIndicator
                  fieldName="timeStampCreated"
                  sortConfig={sortConfig}
                />
              </th>

              <th scope="col" onClick={() => handleSort('timestampModified')}>
                <Button.LikeLink onClick={() => handleSort('timestampCreated')}>
                  {
                    strictGetModel('WorkBench').strictGetField(
                      'timestampModified'
                    ).label
                  }
                </Button.LikeLink>

                <SortIndicator
                  fieldName="timeStampModified"
                  sortConfig={sortConfig}
                />
              </th>

              <td />
            </tr>
          </thead>
          <tbody>
            {sortedDatasets.map((attachmentDataSet) => (
              <tr key={attachmentDataSet.id}>
                <td>
                  <Link.Default
                    className="overflow-x-auto"
                    href={`/specify/attachments/import/${attachmentDataSet.id}`}
                  >
                    {attachmentDataSet.name}
                  </Link.Default>
                </td>
                <td>
                  <DateElement date={attachmentDataSet.timestampcreated} />
                </td>
                <td>
                  {typeof attachmentDataSet.timestampmodified === 'string' ? (
                    <DateElement date={attachmentDataSet.timestampmodified} />
                  ) : null}
                </td>
                <td>
                  <Button.Icon
                    icon="pencil"
                    title={commonText.edit()}
                    onClick={() => setEditing(attachmentDataSet.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Dialog>
    </>
  );
}
