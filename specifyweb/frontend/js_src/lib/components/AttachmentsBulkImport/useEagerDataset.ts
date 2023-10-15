import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ajax } from '../../utils/ajax';
import { Http } from '../../utils/ajax/definitions';
import { ping } from '../../utils/ajax/ping';
import { f } from '../../utils/functools';
import { removeKey } from '../../utils/utils';
import type { EagerDataSet } from './Import';
import { generateUploadSpec } from './SelectUploadPath';
import type { AttachmentDataSet, BoundFile, UnBoundFile } from './types';
import { LoadingContext } from '../Core/Contexts';

type PostResponse = {
  readonly id: number;
  readonly name: string;
};

let syncingResourcePromise: Promise<PostResponse | undefined> | undefined =
  undefined;

const cleanFileBeforeSync = (file: UnBoundFile): BoundFile => ({
  size: file.size,
  name: file.name,
  parsedName: file.parsedName,
  type: file.type,
});

export async function resolveAttachmentDataSetSync(
  rawResourceToSync: EagerDataSet
) {
  const resourceToSync = removeKey(
    {
      ...rawResourceToSync,
      rows: rawResourceToSync.rows.map((uploadable) => ({
        ...uploadable,
        file: f.maybe(uploadable.file, cleanFileBeforeSync),
      })),
    },
    'needsSaved',
    'save'
  ) as AttachmentDataSet;
  if ('id' in resourceToSync) {
    // If not creating new "resource", it is fine to PUT while not resolved.
    return ping(`/attachment_gw/dataset/${resourceToSync.id}/`, {
      headers: { Accept: 'text/plain' },
      method: 'PUT',
      body: JSON.stringify(resourceToSync),
      expectedErrors: [Http.NO_CONTENT],
    }).then(f.undefined);
  }

  // Creating new resource.
  syncingResourcePromise ??= ajax<PostResponse>(`/attachment_gw/dataset/`, {
    headers: { Accept: 'application/json' },
    method: 'POST',
    body: JSON.stringify(resourceToSync),
    expectedErrors: [Http.CREATED],
  })
    .then(({ data }) => data)
    .finally(() => (syncingResourcePromise = undefined));

  return syncingResourcePromise;
}

export function useEagerDataSet(baseDataSet: AttachmentDataSet): {
  readonly eagerDataSet: EagerDataSet;
  readonly triggerSave: () => void;
  readonly commitChange: (
    stateGenerator: (oldState: EagerDataSet) => EagerDataSet
  ) => void;
} {
  const [eagerDataSet, setEagerDataSet] = React.useState<EagerDataSet>({
    ...baseDataSet,
    uploaderstatus:
      baseDataSet.uploaderstatus === 'uploading'
        ? 'uploadInterrupted'
        : baseDataSet.uploaderstatus === 'deleting'
        ? 'deletingInterrupted'
        : 'main',
    needsSaved: baseDataSet.uploaderstatus !== 'main',
    rows: baseDataSet.rows ?? [],
    save: false,
    uploadplan: generateUploadSpec(baseDataSet.uploadplan.staticPathKey),
  });

  const handleSaved = () =>
    setEagerDataSet((oldEagerState) => ({
      ...oldEagerState,
      needsSaved: false,
      save: false,
    }));

  const navigate = useNavigate();
  const loading = React.useContext(LoadingContext);
  React.useEffect(() => {
    let destructorCalled = false;
    if (eagerDataSet.needsSaved && eagerDataSet.save) {
      loading(
        resolveAttachmentDataSetSync(eagerDataSet).then((savedResource) => {
          if (destructorCalled) return;
          if (savedResource !== undefined) {
            navigate(`/specify/attachments/import/${savedResource.id}`);
          } else {
            handleSaved();
          }
        })
      );
    }
    return () => {
      destructorCalled = true;
    };
  }, [eagerDataSet]);

  return {
    eagerDataSet,
    triggerSave: () =>
      setEagerDataSet((oldEagerState) => ({
        ...oldEagerState,
        save: true,
      })),
    commitChange: (stateGenerator) =>
      setEagerDataSet((oldState) => ({
        ...stateGenerator(oldState),
        needsSaved: true,
        save: oldState.save,
      })),
  };
}
