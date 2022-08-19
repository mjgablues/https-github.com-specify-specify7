import React from 'react';

import { ajax } from '../ajax';
import type { Tables } from '../datamodel';
import type { AnySchema } from '../datamodelutils';
import type { SpecifyResource } from '../legacytypes';
import { commonText } from '../localization/common';
import { formsText } from '../localization/forms';
import { getModel } from '../schema';
import type { RA } from '../types';
import { defined } from '../types';
import { Button } from './basic';
import { LoadingContext } from './contexts';
import type { DeleteBlocker } from './deleteblocked';
import { DeleteBlocked } from './deleteblocked';
import { useAsyncState, useBooleanState, useLiveState } from './hooks';
import { icons } from './icons';
import { Dialog, dialogClassNames, loadingBar } from './modaldialog';

const fetchBlockers = async (
  resource: SpecifyResource<AnySchema>
): Promise<RA<DeleteBlocker>> =>
  ajax<
    RA<{
      readonly table: keyof Tables;
      readonly field: string;
      readonly id: number;
    }>
  >(
    `/api/delete_blockers/${resource.specifyModel.name.toLowerCase()}/${
      resource.id
    }/`,
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Accept: 'application/json' },
    }
  ).then(({ data }) =>
    data.map(({ table, ...rest }) => ({
      ...rest,
      model: defined(getModel(table)),
    }))
  );

/**
 * A button to delele a resorce
 * Prompts before deletion
 * Checks for delete blockers (other resources depending on this one) before
 * deletion
 */
export function DeleteButton<SCHEMA extends AnySchema>({
  resource,
  deletionMessage = formsText('deleteConfirmationDialogText'),
  deferred: initialDeferred = false,
  component: ButtonComponent = Button.Gray,
  onDeleted: handleDeleted,
}: {
  readonly resource: SpecifyResource<SCHEMA>;
  readonly deletionMessage?: React.ReactNode;
  /**
   * As a performance optimization, can defer checking for delete blockers
   * until the button is clicked. This is used in the tree viewer as delete
   * button's resource can change often.
   */
  readonly deferred?: boolean;
  readonly component?: typeof Button['Gray'];
  readonly onDeleted?: () => void;
}): JSX.Element {
  const [deferred, setDeferred] = useLiveState<boolean>(
    React.useCallback(() => initialDeferred, [initialDeferred, resource])
  );
  const [blockers, setBlockers] = useAsyncState<RA<DeleteBlocker>>(
    React.useCallback(
      async () => (deferred ? undefined : fetchBlockers(resource)),
      [resource, deferred]
    ),
    false
  );

  const [isOpen, handleOpen, handleClose] = useBooleanState();
  const loading = React.useContext(LoadingContext);

  const isBlocked = Array.isArray(blockers) && blockers.length > 0;
  return (
    <>
      <ButtonComponent
        title={isBlocked ? formsText('deleteBlockedDialogHeader') : undefined}
        onClick={(): void => {
          handleOpen();
          setDeferred(false);
        }}
      >
        {isBlocked ? icons.exclamation : undefined}
        {commonText('delete')}
      </ButtonComponent>
      {isOpen ? (
        blockers === undefined ? (
          <Dialog
            buttons={commonText('cancel')}
            className={{ container: dialogClassNames.narrowContainer }}
            header={commonText('loading')}
            onClose={handleClose}
          >
            {formsText('checkingIfResourceCanBeDeleted')}
            {loadingBar}
          </Dialog>
        ) : blockers.length === 0 ? (
          <Dialog
            buttons={
              <>
                <Button.Red
                  onClick={(): void => {
                    /*
                     * REFACTOR: move this into ResourceApi.js
                     */
                    // @ts-expect-error Changing a read-only parameter
                    resource.needsSaved = false;
                    loading(resource.destroy().then(handleDeleted));
                  }}
                >
                  {commonText('delete')}
                </Button.Red>
                <span className="flex-1 -ml-2" />
                <Button.DialogClose>{commonText('cancel')}</Button.DialogClose>
              </>
            }
            className={{
              container: dialogClassNames.narrowContainer,
            }}
            header={formsText(
              'deleteConfirmationDialogHeader',
              resource.specifyModel.label
            )}
            onClose={handleClose}
          >
            {deletionMessage}
          </Dialog>
        ) : (
          <DeleteBlocked
            blockers={blockers}
            resource={resource}
            onClose={handleClose}
            onDeleted={(): void => setBlockers([])}
          />
        )
      ) : undefined}
    </>
  );
}
