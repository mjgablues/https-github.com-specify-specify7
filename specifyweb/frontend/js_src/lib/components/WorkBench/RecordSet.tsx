import React from 'react';

import { useBooleanState } from '../../hooks/useBooleanState';
import { queryText } from '../../localization/query';
import { wbText } from '../../localization/workbench';
import { ajax } from '../../utils/ajax';
import { formData } from '../../utils/ajax/helpers';
import { Button } from '../Atoms/Button';
import { LoadingContext } from '../Core/Contexts';
import { schema } from '../DataModel/schema';
import {
  ProtectedAction,
  ProtectedTool,
} from '../Permissions/PermissionDenied';
import { unsafeNavigate } from '../Router/Router';
import { EditRecordSet } from '../Toolbar/RecordSetEdit';

export function CreateRecordSetButton({
  dataSetId,
  dataSetName,
  onClose: handleClosed,
  small,
}: {
  readonly dataSetId: number;
  readonly dataSetName: string;
  readonly onClose: () => void;
  readonly small: boolean;
}): JSX.Element {
  const [isOpen, handleOpen, handleClose] = useBooleanState();
  const ButtonComponent = small ? Button.Small : Button.Info;
  return (
    <ProtectedAction action="create_recordset" resource="/workbench/dataset">
      <ProtectedTool action="create" tool="recordSets">
        <ButtonComponent onClick={handleOpen}>
          {queryText.createRecordSet({
            recordSetTable: schema.models.RecordSet.label,
          })}
        </ButtonComponent>
        {isOpen && (
          <CreateRecordSetDialog
            dataSetId={dataSetId}
            dataSetName={dataSetName}
            onClose={(): void => {
              handleClose();
              handleClosed();
            }}
          />
        )}
      </ProtectedTool>
    </ProtectedAction>
  );
}

function CreateRecordSetDialog({
  dataSetId,
  dataSetName,
  onClose: handleClose,
}: {
  readonly dataSetId: number;
  readonly dataSetName: string;
  readonly onClose: () => void;
}): JSX.Element {
  const recordSet = React.useMemo(
    () =>
      new schema.models.RecordSet.Resource({
        name: wbText.recordSetName({ dataSet: dataSetName }),
      }),
    [dataSetId]
  );

  const loading = React.useContext(LoadingContext);
  return (
    <EditRecordSet
      isReadOnly={false}
      recordSet={recordSet}
      onClose={handleClose}
      onSaving={(unsetUnloadProtect): false => {
        unsetUnloadProtect();
        loading(
          ajax<number>(`/api/workbench/create_recordset/${dataSetId}/`, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: formData({ name: recordSet.get('name') }),
            errorMode: 'dismissible',
          }).then(({ data }) => unsafeNavigate(`/specify/record-set/${data}/`))
        );
        return false;
      }}
    />
  );
}
