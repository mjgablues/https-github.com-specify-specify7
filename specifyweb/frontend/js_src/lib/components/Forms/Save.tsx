import React from 'react';

import { useUnloadProtect } from '../../hooks/navigation';
import { useBooleanState } from '../../hooks/useBooleanState';
import { useId } from '../../hooks/useId';
import { useIsModified } from '../../hooks/useIsModified';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import { listen } from '../../utils/events';
import { camelToHuman, replaceKey } from '../../utils/utils';
import { H3, Ul } from '../Atoms';
import { Button } from '../Atoms/Button';
import { className } from '../Atoms/className';
import { Submit } from '../Atoms/Submit';
import { FormContext, LoadingContext } from '../Core/Contexts';
import type { AnySchema } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import { resourceOn } from '../DataModel/resource';
import { error } from '../Errors/assert';
import { Dialog } from '../Molecules/Dialog';
import { hasTablePermission } from '../Permissions/helpers';
import { smoothScroll } from '../QueryBuilder/helpers';
import { usePref } from '../UserPreferences/usePref';
import { NO_CLONE } from './ResourceView';

export const saveFormUnloadProtect = formsText('unsavedFormUnloadProtect');

/*
 * REFACTOR: move this logic into ResourceView, so that <form> and button is
 *   defined in the same place
 * BUG: if required field is set as readonly in the form, it will prevent
 *   saving, but validation error won't be shown
 */
/**
 * A button to save a resource
 * Checks for save blockers and validation errors
 * Handles save conflicts
 */
export function SaveButton<SCHEMA extends AnySchema = AnySchema>({
  resource,
  form,
  disabled = false,
  saveRequired: externalSaveRequired = false,
  onSaving: handleSaving,
  onSaved: handleSaved,
  onAdd: handleAdd,
  onIgnored: handleIgnored,
}: {
  readonly resource: SpecifyResource<SCHEMA>;
  readonly form: HTMLFormElement;
  readonly disabled?: boolean;
  /*
   * Can enable Save button even if no save is required (i.e., when there were
   * changes to fields that are not stored with the resource
   */
  readonly saveRequired?: boolean;
  // Returning false would cancel the save proces (allowing to trigger custom behaviour)
  readonly onSaving?: (
    unsetUnloadProtect: () => void
  ) => false | undefined | void;
  readonly onSaved?: () => void;
  readonly onAdd?: (newResource: SpecifyResource<SCHEMA>) => void;
  /**
   * Sometimes a save button click is ignored (mostly because of a validation
   * error). By default, this would focus the first erroring field on the form.
   * However, if the save blocker is not caused by some field on the form,
   * need to handle the ignored click manually.
   */
  readonly onIgnored?: () => void;
}): JSX.Element {
  const id = useId('save-button');
  const saveRequired = useIsModified(resource);
  const unsetUnloadProtect = useUnloadProtect(
    saveRequired || externalSaveRequired,
    saveFormUnloadProtect
  );

  const [saveBlocked, setSaveBlocked] = React.useState(false);
  React.useEffect(() => {
    setSaveBlocked(false);
    return resourceOn(
      resource,
      'blockersChanged',
      (): void => {
        const onlyDeferredBlockers = Array.from(
          resource.saveBlockers?.blockingResources ?? []
        ).every((resource) => resource.saveBlockers?.hasOnlyDeferredBlockers());
        setSaveBlocked(!onlyDeferredBlockers);
      },
      true
    );
  }, [resource]);

  const [isSaving, setIsSaving] = React.useState(false);
  const [showSaveBlockedDialog, setShowBlockedDialog] = React.useState(false);
  const [isSaveConflict, hasSaveConflict] = useBooleanState();

  const [formId, setFormId] = React.useState(id('form'));
  React.useEffect(() => {
    if (form.id === '') form.id = id('form');
    setFormId(form.id);
  }, [form, id]);

  const loading = React.useContext(LoadingContext);
  const [formContext, setFormContext] = React.useContext(FormContext);

  const [globalCanCarryForward] = usePref(
    'form',
    'preferences',
    'disableCarryForward'
  );
  const canCarryForward =
    !globalCanCarryForward.includes(resource.specifyModel.name) &&
    !NO_CLONE.has(resource.specifyModel.name);

  const canCreate = hasTablePermission(resource.specifyModel.name, 'create');
  const canUpdate = hasTablePermission(resource.specifyModel.name, 'update');
  const canSave = resource.isNew() ? canCreate : canUpdate;

  React.useEffect(
    () =>
      listen(form, 'submit', (event) => {
        if (!form.reportValidity()) return;

        setFormContext?.(replaceKey(formContext, 'triedToSubmit', true));
        event.preventDefault();
        event.stopPropagation();

        if (
          // Cancel if don't have permission for this action
          !canSave ||
          // Or save is blocked
          saveBlocked ||
          // Or trying to save a resources that doesn't need saving
          (!saveRequired && !externalSaveRequired && !resource.isNew())
        ) {
          handleIgnored?.();
          return;
        }

        loading(
          (resource.businessRuleMgr?.pending ?? Promise.resolve()).then(() => {
            const blockingResources = Array.from(
              resource.saveBlockers?.blockingResources ?? []
            );
            blockingResources.forEach((resource) =>
              resource.saveBlockers?.fireDeferredBlockers()
            );
            if (blockingResources.length > 0) {
              setShowBlockedDialog(true);
              return;
            }

            /*
             * Save process is canceled if false was returned. This also allows to
             * implement custom save behavior
             */
            if (handleSaving?.(unsetUnloadProtect) === false) return;

            setIsSaving(true);
            return resource
              .save({ onSaveConflict: hasSaveConflict })
              .catch((error_) =>
                // FEATURE: if form save fails, should make the error message dismissable (if safe)
                Object.getOwnPropertyDescriptor(error_ ?? {}, 'handledBy')
                  ?.value === hasSaveConflict
                  ? undefined
                  : error(error_)
              )
              .finally(() => {
                unsetUnloadProtect();
                handleSaved?.();
                setIsSaving(false);
              });
          })
        );
      }),
    [loading, form]
  );

  // FEATURE: these buttons should use var(--brand-color), rather than orange
  const ButtonComponent = saveBlocked ? Button.Red : Button.Orange;
  const SubmitComponent = saveBlocked ? Submit.Red : Submit.Orange;
  // Don't allow cloning the resource if it changed
  const isChanged = saveRequired || externalSaveRequired || resource.isNew();
  return (
    <>
      {typeof handleAdd === 'function' && canCreate ? (
        <>
          <ButtonComponent
            className={saveBlocked ? '!cursor-not-allowed' : undefined}
            disabled={isSaving || isChanged}
            onClick={(): void => {
              smoothScroll(form, 0);
              loading(
                (canCarryForward
                  ? resource.clone()
                  : Promise.resolve(new resource.specifyModel.Resource())
                ).then(handleAdd)
              );
            }}
          >
            {formsText('addAnother')}
          </ButtonComponent>
        </>
      ) : undefined}
      {canSave && (
        <SubmitComponent
          className={saveBlocked ? '!cursor-not-allowed' : undefined}
          disabled={
            disabled ||
            isSaving ||
            (!saveRequired &&
              !externalSaveRequired &&
              /*
               * Don't disable the button if saveBlocked, so that clicking the
               * button would make browser focus the invalid field
               */
              !saveBlocked &&
              /*
               * Enable the button for new resources, even if there are no
               * unsaved changes so that empty resources can be saved. If that
               * is not desirable, remove the following line
               */
              !resource.isNew())
          }
          form={formId}
          onClick={(): void =>
            form.classList.remove(className.notSubmittedForm)
          }
        >
          {commonText('save')}
        </SubmitComponent>
      )}
      {isSaveConflict ? (
        <Dialog
          buttons={
            <Button.Red onClick={(): void => globalThis.location.reload()}>
              {commonText('close')}
            </Button.Red>
          }
          header={formsText('saveConflictDialogHeader')}
          onClose={undefined}
        >
          {formsText('saveConflictDialogText')}
        </Dialog>
      ) : showSaveBlockedDialog ? (
        <Dialog
          buttons={commonText('close')}
          header={formsText('saveBlockedDialogHeader')}
          onClose={(): void => setShowBlockedDialog(false)}
        >
          <p>{formsText('saveBlockedDialogText')}</p>
          <Ul>
            {Array.from(
              resource.saveBlockers?.blockingResources ?? [],
              (resource) => (
                <li key={resource.cid}>
                  <H3>{resource.specifyModel.label}</H3>
                  <dl>
                    {Object.entries(resource.saveBlockers?.blockers ?? []).map(
                      ([key, blocker]) => (
                        <React.Fragment key={key}>
                          <dt>
                            {typeof blocker.fieldName === 'string'
                              ? resource.specifyModel.strictGetField(
                                  blocker.fieldName
                                ).label
                              : camelToHuman(key)}
                          </dt>
                          <dd>{blocker.reason}</dd>
                        </React.Fragment>
                      )
                    )}
                  </dl>
                </li>
              )
            )}
          </Ul>
        </Dialog>
      ) : undefined}
    </>
  );
}
