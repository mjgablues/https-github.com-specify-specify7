import React from 'react';
import type { LocalizedString } from 'typesafe-i18n';

import { useAsyncState } from '../../hooks/useAsyncState';
import { useBooleanState } from '../../hooks/useBooleanState';
import { useId } from '../../hooks/useId';
import { commonText } from '../../localization/common';
import { StringToJsx } from '../../localization/utils';
import { wbText } from '../../localization/workbench';
import { Http } from '../../utils/ajax/definitions';
import { formData } from '../../utils/ajax/helpers';
import { ping } from '../../utils/ajax/ping';
import type { RA } from '../../utils/types';
import { overwriteReadOnly } from '../../utils/types';
import { Button } from '../Atoms/Button';
import { Form, Input, Label, Select } from '../Atoms/Form';
import { icons } from '../Atoms/Icons';
import { formatNumber } from '../Atoms/Internationalization';
import { Submit } from '../Atoms/Submit';
import { LoadingContext } from '../Core/Contexts';
import { Backbone } from '../DataModel/backbone';
import { fetchCollection } from '../DataModel/collection';
import { getField } from '../DataModel/helpers';
import type { SerializedResource } from '../DataModel/helperTypes';
import { schema } from '../DataModel/schema';
import type { SpecifyUser } from '../DataModel/types';
import { userInformation } from '../InitialContext/userInformation';
import { useTitle } from '../Molecules/AppTitle';
import { AutoGrowTextArea } from '../Molecules/AutoGrowTextArea';
import { DateElement } from '../Molecules/DateElement';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { FormattedResourceUrl } from '../Molecules/FormattedResource';
import { TableIcon } from '../Molecules/TableIcon';
import { hasPermission } from '../Permissions/helpers';
import { unsafeNavigate } from '../Router/Router';
import { getMaxDataSetLength, uniquifyDataSetName } from '../WbImport/helpers';
import type { Dataset } from '../WbPlanView/Wrapped';

// FEATURE: allow exporting/importing the mapping
export function DataSetMeta({
  dataset,
  getRowCount = (): number => dataset.rows.length,
  onClose: handleClose,
  onChange: handleChange,
  onDeleted: handleDeleted,
}: {
  readonly dataset: Dataset;
  readonly getRowCount?: () => number;
  readonly onClose: () => void;
  readonly onChange: (dataSetName: LocalizedString) => void;
  readonly onDeleted: () => void;
}): JSX.Element | null {
  const id = useId('data-set-meta');
  const [name, setName] = React.useState(dataset.name);
  const [remarks, setRemarks] = React.useState(dataset.remarks ?? '');

  const loading = React.useContext(LoadingContext);

  const [isDeleted, setIsDeleted] = React.useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  return isDeleted ? (
    <Dialog
      buttons={<Button.DialogClose>{commonText.close()}</Button.DialogClose>}
      header={wbText.dataSetDeleted()}
      onClose={handleDeleted}
    >
      {wbText.dataSetDeletedDescription()}
    </Dialog>
  ) : showDeleteConfirm ? (
    <Dialog
      buttons={
        <>
          {hasPermission('/workbench/dataset', 'delete') && (
            <Button.Danger
              onClick={() => {
                loading(
                  ping(`/api/workbench/dataset/${dataset.id}/`, {
                    method: 'DELETE',
                    errorMode: 'dismissible',
                    expectedErrors: [Http.NOT_FOUND],
                  }).then(() => setIsDeleted(true))
                );
              }}
            >
              {commonText.delete()}
            </Button.Danger>
          )}
          <span className="-ml-2 flex-1" />
          <Button.DialogClose>{commonText.cancel()}</Button.DialogClose>
        </>
      }
      className={{
        container: dialogClassNames.narrowContainer,
      }}
      header={wbText.deleteDataSet()}
      icon={<span className="text-blue-500"> {icons.table}</span>}
      onClose={handleClose}
    >
      {wbText.deleteDataSetDescription()}
    </Dialog>
  ) : (
    <Dialog
      buttons={
        <>
          {hasPermission('/workbench/dataset', 'delete') && (
            <Button.Danger
              onClick={() => {
                setShowDeleteConfirm(true);
              }}
            >
              {commonText.delete()}
            </Button.Danger>
          )}
          <span className="-ml-2 flex-1" />
          <Button.DialogClose>{commonText.close()}</Button.DialogClose>
          <Submit.Save form={id('form')}>{commonText.save()}</Submit.Save>
        </>
      }
      header={wbText.dataSetMeta()}
      icon={<span className="text-blue-500"> {icons.table}</span>}
      onClose={handleClose}
    >
      <Form
        id={id('form')}
        onSubmit={(): void =>
          loading(
            (name.trim() === dataset.name && remarks.trim() === dataset.remarks
              ? Promise.resolve(dataset.name)
              : uniquifyDataSetName(name.trim(), dataset.id).then(
                  async (uniqueName) =>
                    ping(`/api/workbench/dataset/${dataset.id}/`, {
                      method: 'PUT',
                      body: { name: uniqueName, remarks: remarks.trim() },
                    }).then(() => {
                      // REFACTOR: replace this with a callback
                      overwriteReadOnly(dataset, 'name', uniqueName);
                      overwriteReadOnly(dataset, 'remarks', remarks.trim());
                      return uniqueName as LocalizedString;
                    })
                )
            ).then(handleChange)
          )
        }
      >
        <Label.Block>
          <b>{wbText.dataSetName()}</b>
          <Input.Text
            maxLength={getMaxDataSetLength()}
            required
            spellCheck
            value={name}
            onValueChange={(name): void => setName(name as LocalizedString)}
          />
        </Label.Block>
        <Label.Block>
          <b>{getField(schema.models.Workbench, 'remarks').label}:</b>
          <AutoGrowTextArea value={remarks} onValueChange={setRemarks} />
        </Label.Block>
        <div className="flex flex-col">
          <b>
            {
              getField(schema.models.WorkbenchTemplateMappingItem, 'metaData')
                .label
            }
          </b>
          <span>
            {commonText.colonLine({
              label: wbText.numberOfRows(),
              value: formatNumber(getRowCount()),
            })}
          </span>
          <span>
            {commonText.colonLine({
              label: wbText.numberOfColumns(),
              value: formatNumber(dataset.columns.length),
            })}
          </span>
          <span>
            <StringToJsx
              components={{
                wrap: (
                  <i>
                    <DateElement date={dataset.timestampcreated} flipDates />
                  </i>
                ),
              }}
              string={commonText.jsxColonLine({
                label: getField(schema.models.Workbench, 'timestampCreated')
                  .label,
              })}
            />
          </span>
          <span>
            <StringToJsx
              components={{
                wrap: (
                  <i>
                    <DateElement date={dataset.timestampmodified} flipDates />
                  </i>
                ),
              }}
              string={commonText.jsxColonLine({
                label: getField(schema.models.Workbench, 'timestampModified')
                  .label,
              })}
            />
          </span>
          <span>
            <StringToJsx
              components={{
                wrap: (
                  <i>
                    <DateElement
                      date={
                        dataset.uploadresult?.success === true
                          ? dataset.uploadresult?.timestamp
                          : undefined
                      }
                      fallback={commonText.no()}
                      flipDates
                    />
                  </i>
                ),
              }}
              string={commonText.jsxColonLine({
                label: commonText.uploaded(),
              })}
            />
          </span>
          <span>
            <StringToJsx
              components={{
                wrap: (
                  <i>
                    <FormattedResourceUrl
                      resourceUrl={dataset.createdbyagent}
                    />
                  </i>
                ),
              }}
              string={commonText.jsxColonLine({
                label: getField(schema.models.Workbench, 'createdByAgent')
                  .label,
              })}
            />
          </span>
          <span>
            <StringToJsx
              components={{
                wrap: (
                  <i>
                    {typeof dataset.modifiedbyagent === 'string' ? (
                      <FormattedResourceUrl
                        resourceUrl={dataset.modifiedbyagent}
                      />
                    ) : (
                      commonText.notApplicable()
                    )}
                  </i>
                ),
              }}
              string={commonText.jsxColonLine({
                label: getField(schema.models.Workbench, 'modifiedByAgent')
                  .label,
              })}
            />
          </span>
          <span>
            <StringToJsx
              components={{
                wrap: <i>{dataset.importedfilename || wbText.noFileName()}</i>,
              }}
              string={commonText.jsxColonLine({
                label: wbText.importedFileName(),
              })}
            />
          </span>
        </div>
      </Form>
    </Dialog>
  );
}

function DataSetName({
  dataset,
  getRowCount,
}: {
  readonly dataset: Dataset;
  readonly getRowCount: () => number;
}): JSX.Element {
  const [showMeta, handleOpen, handleClose] = useBooleanState();
  const [name, setName] = React.useState(dataset.name);

  useTitle(name);

  return (
    <>
      {' '}
      <h2 className="flex gap-1 overflow-y-auto">
        {dataset.uploadplan !== null && (
          <TableIcon label name={dataset.uploadplan.baseTableName} />
        )}
        {commonText.colonLine({
          label: wbText.dataSet(),
          value: name,
        })}
        {dataset.uploadresult?.success === true && (
          <span className="text-red-600">{wbText.dataSetUploadedLabel()}</span>
        )}
      </h2>
      <Button.Small onClick={handleOpen}>
        {getField(schema.models.WorkbenchTemplateMappingItem, 'metaData').label}
      </Button.Small>
      {showMeta && (
        <DataSetMeta
          dataset={dataset}
          getRowCount={getRowCount}
          onChange={(name): void => {
            handleClose();
            setName(name);
          }}
          onClose={handleClose}
          onDeleted={() => unsafeNavigate('/specify/', { replace: true })}
        />
      )}
    </>
  );
}

const fetchListOfUsers = async (): Promise<
  RA<SerializedResource<SpecifyUser>>
> =>
  fetchCollection('SpecifyUser', { limit: 500 }).then(({ records: users }) =>
    users.filter(({ id }) => id !== userInformation.id)
  );

function ChangeOwner({
  dataset,
  onClose: handleClose,
}: {
  readonly dataset: Dataset;
  readonly onClose: () => void;
}): JSX.Element | null {
  const [users] = useAsyncState<RA<SerializedResource<SpecifyUser>>>(
    fetchListOfUsers,
    true
  );

  const id = useId('change-data-set-owner');
  const [newOwner, setNewOwner] = React.useState<number | undefined>(undefined);
  const [isChanged, setIsChanged] = React.useState(false);
  const loading = React.useContext(LoadingContext);

  return users === undefined ? null : isChanged ? (
    <Dialog
      buttons={commonText.close()}
      header={wbText.dataSetOwnerChanged()}
      onClose={(): void => unsafeNavigate('/specify/', { replace: true })}
    >
      <p>{wbText.dataSetOwnerChanged()}</p>
    </Dialog>
  ) : (
    <Dialog
      buttons={
        <>
          <Button.DialogClose>{commonText.cancel()}</Button.DialogClose>
          <Submit.Blue disabled={newOwner === undefined} form={id('form')}>
            {wbText.changeOwner()}
          </Submit.Blue>
        </>
      }
      header={wbText.changeDataSetOwner()}
      onClose={handleClose}
    >
      <Form
        id={id('form')}
        onSubmit={(): void =>
          loading(
            ping(`/api/workbench/transfer/${dataset.id}/`, {
              method: 'POST',
              body: formData({
                specifyuserid: newOwner!,
              }),
            }).then(() => setIsChanged(true))
          )
        }
      >
        <Label.Block>
          <p>{wbText.changeDataSetOwnerDescription()}</p>
          <Select
            size={10}
            value={newOwner}
            onChange={({ target }): void =>
              setNewOwner(Number.parseInt(target.value))
            }
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </Label.Block>
      </Form>
    </Dialog>
  );
}

// A wrapper for DS Meta for embedding in the WB
export const DataSetNameView = Backbone.View.extend({
  __name__: 'DataSetNameView',
  render() {
    this.dataSetMeta = this.options.display(
      <DataSetName
        dataset={this.options.dataset}
        getRowCount={this.options.getRowCount}
      />,
      this.el.getElementsByClassName('wb-name-container')[0]
    );
    return this;
  },
  changeOwner() {
    const handleClose = (): void => void this.changeOwnerView();
    this.changeOwnerView = this.options.display(
      <ChangeOwner dataset={this.options.dataset} onClose={handleClose} />
    );
  },
  remove() {
    this.dataSetMeta();
    this.changeOwnerView?.();
    Backbone.View.prototype.remove.call(this);
  },
});
