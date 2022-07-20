import React from 'react';
import type { State } from 'typesafe-reducer';

import type { SpecifyUser } from '../datamodel';
import { f } from '../functools';
import { replaceKey } from '../helpers';
import type { SpecifyResource } from '../legacytypes';
import { adminText } from '../localization/admin';
import { commonText } from '../localization/common';
import { hasPermission, hasTablePermission } from '../permissionutils';
import { schema } from '../schema';
import type { RA } from '../types';
import { userInformation } from '../userinfo';
import { Button, className, Form, Input, Label, Submit, Ul } from './basic';
import { AppTitle, AutoGrowTextArea } from './common';
import { useLiveState, useTriggerState } from './hooks';
import { icons } from './icons';
import { Dialog } from './modaldialog';
import { useUnloadProtect } from './navigation';
import { SearchDialog } from './searchdialog';
import type { UserRoles } from './securitycollection';
import { SecurityImportExport } from './securityimportexport';
import type { Policy } from './securitypolicy';
import { SecurityPolicies, SecurityPoliciesWrapper } from './securitypolicy';

export type NewRole = {
  readonly id: number | undefined;
  readonly name: string;
  readonly description: string;
  readonly policies: RA<Policy>;
};

export type Role = NewRole & {
  readonly id: number;
};

const roleNameMaxLength = 1024;

export function RoleView({
  role: initialRole,
  parentName,
  userRoles,
  permissionName,
  collectionId,
  onDelete: handleDelete,
  onSave: handleSave,
  onClose: handleClose,
  onOpenUser: handleOpenUser,
  onAddUsers: handleAddUsers,
}: {
  readonly role: NewRole | Role;
  readonly parentName: string | undefined;
  readonly userRoles: UserRoles | undefined;
  /*
   * All these are delegated to the parent resource so that the parent
   * can update its list of roles
   */
  readonly permissionName: '/permissions/library/roles' | '/permissions/roles';
  readonly collectionId: number;
  readonly onSave: (role: NewRole | Role) => void;
  readonly onDelete: () => void;
  readonly onClose: () => void;
  readonly onOpenUser: ((userId: number) => void) | undefined;
  readonly onAddUsers:
    | ((user: RA<SpecifyResource<SpecifyUser>>) => void)
    | undefined;
}): JSX.Element {
  const [role, setRole] = useTriggerState(initialRole);
  const changesMade =
    role.id === undefined ||
    JSON.stringify(initialRole) !== JSON.stringify(role);
  const unsetUnloadProtect = useUnloadProtect(
    changesMade,
    commonText('leavePageDialogText')
  );
  const [state, setState] = useLiveState<
    | State<'MainState'>
    | State<
        'AddUserState',
        { readonly templateResource: SpecifyResource<SpecifyUser> }
      >
    | State<'DeletionPromptState'>
    // Close AddUser dialog when new user is added
  >(React.useCallback(() => ({ type: 'MainState' }), [userRoles]));

  const isReadOnly =
    typeof role.id === 'number' &&
    !hasPermission(permissionName, 'update', collectionId);

  return (
    <Form className="contents" onSubmit={(): void => handleSave(role)}>
      <h3 className="text-xl">{`${adminText('role')} ${role.name}`}</h3>
      <AppTitle title={role.name} type="form" />
      <Button.LikeLink onClick={handleClose}>
        {icons.arrowLeft}
        {parentName}
      </Button.LikeLink>
      <div className="flex flex-1 flex-col gap-2 overflow-auto">
        {!isReadOnly && (
          <Label.Generic className={className.limitedWidth}>
            {commonText('name')}
            <Input.Text
              maxLength={roleNameMaxLength}
              required
              value={role.name}
              onValueChange={(name): void =>
                setRole(replaceKey(role, 'name', name))
              }
            />
          </Label.Generic>
        )}
        <Label.Generic className={className.limitedWidth}>
          {commonText('description')}
          <AutoGrowTextArea
            isReadOnly={isReadOnly}
            value={role.description}
            onValueChange={(description): void =>
              setRole(replaceKey(role, 'description', description))
            }
          />
        </Label.Generic>
        {typeof role.id === 'number' &&
        typeof handleOpenUser === 'function' &&
        hasPermission('/permissions/user/roles', 'read', collectionId) ? (
          <fieldset className="flex flex-col gap-2">
            <legend>{adminText('users')}</legend>
            {typeof userRoles === 'object' ? (
              <>
                <Ul className="flex max-h-[theme(spacing.96)] flex-col gap-2 overflow-auto">
                  {userRoles.map(({ userId, userName }) => (
                    <li key={userId}>
                      <Button.LikeLink
                        disabled={
                          userId !== userInformation.id &&
                          !hasTablePermission('SpecifyUser', 'read')
                        }
                        // BUG: trigger unload protect
                        onClick={(): void => handleOpenUser(userId)}
                      >
                        {userName}
                      </Button.LikeLink>
                    </li>
                  ))}
                </Ul>
                {hasPermission(
                  '/permissions/user/roles',
                  'update',
                  collectionId
                ) && (
                  <div>
                    <Button.Green
                      onClick={(): void =>
                        setState({
                          type: 'AddUserState',
                          templateResource:
                            new schema.models.SpecifyUser.Resource(),
                        })
                      }
                    >
                      {commonText('add')}
                    </Button.Green>
                  </div>
                )}
                {state.type === 'AddUserState' &&
                typeof handleAddUsers === 'function' ? (
                  <SearchDialog
                    extraFilters={[
                      {
                        field: 'id',
                        operation: 'notIn',
                        values: userRoles.map(({ userId }) =>
                          userId.toString()
                        ),
                      },
                    ]}
                    forceCollection={undefined}
                    multiple
                    templateResource={state.templateResource}
                    onClose={(): void => setState({ type: 'MainState' })}
                    onSelected={handleAddUsers}
                  />
                ) : undefined}
              </>
            ) : (
              commonText('loading')
            )}
          </fieldset>
        ) : undefined}
        <SecurityPoliciesWrapper
          collapsable={false}
          header={adminText('rolePolicies')}
          policies={role.policies}
        >
          <SecurityPolicies
            isReadOnly={isReadOnly}
            limitHeight={false}
            policies={role.policies}
            scope="collection"
            onChange={(policies): void =>
              setRole(replaceKey(role, 'policies', policies))
            }
          />
        </SecurityPoliciesWrapper>
      </div>
      <div className="flex gap-2">
        {typeof role.id === 'number' &&
        hasPermission(permissionName, 'delete', collectionId) ? (
          <Button.Red
            disabled={
              userRoles === undefined && typeof handleAddUsers === 'function'
            }
            onClick={
              userRoles?.length === 0
                ? handleDelete
                : (): void =>
                    setState({
                      type: 'DeletionPromptState',
                    })
            }
          >
            {commonText('remove')}
          </Button.Red>
        ) : undefined}
        {changesMade ? (
          <Button.Red
            onClick={(): void => {
              unsetUnloadProtect();
              handleClose();
            }}
          >
            {commonText('cancel')}
          </Button.Red>
        ) : (
          <Button.Blue onClick={handleClose}>{commonText('close')}</Button.Blue>
        )}
        <span className="-ml-2 flex-1" />
        {typeof role.id === 'number' && (
          <SecurityImportExport
            baseName={role.name ?? ''}
            collectionId={collectionId}
            isReadOnly
            permissionName={permissionName}
            roles={{ [role.id]: role as Role }}
            onCreateRole={f.never}
            onUpdateRole={f.never}
          />
        )}
        {!isReadOnly && (
          <Submit.Green disabled={!changesMade}>
            {commonText('save')}
          </Submit.Green>
        )}
      </div>
      {state.type === 'DeletionPromptState' && (
        <Dialog
          buttons={
            <>
              <Button.DialogClose>{commonText('cancel')}</Button.DialogClose>
              <Button.Red onClick={handleDelete}>
                {commonText('delete')}
              </Button.Red>
            </>
          }
          header={adminText('deleteRoleDialogHeader')}
          onClose={(): void => setState({ type: 'MainState' })}
        >
          {adminText('deleteRoleDialogText')}
        </Dialog>
      )}
    </Form>
  );
}
