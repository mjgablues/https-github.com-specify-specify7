import React from 'react';

import type { Collection, SpecifyUser } from '../datamodel';
import type { SerializedResource } from '../datamodelutils';
import { f } from '../functools';
import { replaceItem, replaceKey, sortFunction, toggleItem } from '../helpers';
import type { SpecifyResource } from '../legacytypes';
import { adminText } from '../localization/admin';
import { commonText } from '../localization/common';
import type { FormMode } from '../parseform';
import { collectionAccessResource, hasPermission } from '../permissions';
import { resourceOn } from '../resource';
import { schema } from '../schema';
import { anyResource } from '../securityutils';
import type { IR, RA, RR } from '../types';
import { defined, filterArray } from '../types';
import { userInformation } from '../userinfo';
import { AdminStatusPlugin } from './adminstatusplugin';
import {
  Button,
  className,
  DataEntry,
  Input,
  Label,
  Select,
  Ul,
} from './basic';
import { ComboBox } from './combobox';
import { Dialog } from './modaldialog';
import { QueryComboBox } from './querycombobox';
import type { Policy } from './securitypolicy';
import type { Role } from './securityrole';
import type { UserAgents } from './securityuserhooks';
import { UserCollectionsPlugin } from './usercollectionsplugin';

export function SetSuperAdmin({
  institutionPolicies,
  isSuperAdmin,
  allActions,
  onChange: handleChange,
}: {
  readonly institutionPolicies: RA<Policy> | undefined;
  readonly isSuperAdmin: boolean;
  readonly allActions: RA<string>;
  readonly onChange: (value: RA<Policy>) => void;
}): JSX.Element {
  return typeof institutionPolicies === 'object' ? (
    <Label.ForCheckbox>
      <Input.Checkbox
        isReadOnly={!userInformation.isadmin}
        onValueChange={(): void =>
          handleChange(
            isSuperAdmin
              ? filterArray(
                  institutionPolicies.filter(
                    (policy) => policy.resource !== anyResource
                  )
                )
              : f.var(
                  institutionPolicies.findIndex(
                    ({ resource }) => resource === anyResource
                  ),
                  (index) =>
                    index === -1
                      ? [
                          ...institutionPolicies,
                          {
                            resource: anyResource,
                            actions: allActions,
                          },
                        ]
                      : replaceItem(
                          institutionPolicies,
                          index,
                          replaceKey(
                            institutionPolicies[index],
                            'actions',
                            allActions
                          )
                        )
                )
          )
        }
        checked={isSuperAdmin}
      />
      {adminText('institutionAdmin')}
    </Label.ForCheckbox>
  ) : (
    <>{commonText('loading')}</>
  );
}

export function UserRoles({
  collectionRoles,
  collectionId,
  userRoles,
  onChange: handleChange,
  onOpenRole: handleOpenRole,
}: {
  readonly collectionRoles: RR<number, RA<Role> | undefined> | undefined;
  readonly collectionId: number;
  readonly userRoles: IR<RA<number>> | undefined;
  readonly onChange: (value: IR<RA<number>>) => void;
  readonly onOpenRole: (collectionId: number, roleId: number) => void;
}): JSX.Element | null {
  return typeof collectionRoles !== 'object' ||
    typeof collectionRoles[collectionId] === 'object' ? (
    <fieldset className="flex flex-col gap-2">
      <legend>
        <span className={className.headerGray}>{adminText('userRoles')}:</span>
      </legend>
      <Ul className="flex flex-col gap-1">
        {typeof collectionRoles === 'object' && typeof userRoles === 'object'
          ? defined(collectionRoles[collectionId]).map((role) => (
              <li key={role.id} className="flex items-center gap-2">
                <Label.ForCheckbox>
                  <Input.Checkbox
                    disabled={
                      !hasPermission('/permissions/user/roles', 'update')
                    }
                    checked={userRoles[collectionId].includes(role.id)}
                    onValueChange={(): void =>
                      handleChange(
                        replaceKey(
                          userRoles,
                          collectionId.toString(),
                          Array.from(
                            toggleItem(userRoles[collectionId], role.id)
                          ).sort(sortFunction(f.id))
                        )
                      )
                    }
                  />
                  {role.name}
                </Label.ForCheckbox>
                <DataEntry.Edit
                  // TODO: trigger unload protect
                  onClick={(): void => handleOpenRole(collectionId, role.id)}
                />
              </li>
            ))
          : commonText('loading')}
      </Ul>
    </fieldset>
  ) : null;
}

export function LegacyPermissions({
  userResource,
  mode,
}: {
  readonly userResource: SpecifyResource<SpecifyUser>;
  readonly mode: FormMode;
}): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h4 className={className.headerGray}>{adminText('legacyPermissions')}</h4>
      <div className="flex gap-2">
        <AdminStatusPlugin user={userResource} mode={mode} />
        {hasPermission('/admin/user/sp6/collection_access', 'read') && (
          <UserCollectionsPlugin user={userResource} />
        )}
      </div>
      {f.var(
        defined(schema.models.SpecifyUser.getLiteralField('userType')),
        (userType) => (
          <Label.Generic title={userType.getLocalizedDesc()}>
            {userType.label}
            <ComboBox
              id={undefined}
              model={userResource}
              resource={userResource}
              field={userType}
              fieldName={userType.name}
              pickListName={undefined}
              defaultValue={undefined}
              mode={mode}
              isRequired={true}
              isDisabled={false}
              formType="form"
            />
          </Label.Generic>
        )
      )}
    </section>
  );
}

export function SetPasswordPrompt({
  onClose: handleClose,
  onSet: handleSet,
  onIgnore: handleIgnore,
}: {
  readonly onClose: () => void;
  readonly onSet: () => void;
  readonly onIgnore: () => void;
}): JSX.Element {
  return (
    <Dialog
      header={adminText('setPassword')}
      onClose={handleClose}
      buttons={
        <>
          <Button.Red onClick={handleIgnore}>{commonText('ignore')}</Button.Red>
          <Button.Green onClick={handleSet}>
            {adminText('setPassword')}
          </Button.Green>
        </>
      }
    >
      {adminText('setPasswordDialogText')}
    </Dialog>
  );
}

export function SetCollection({
  collectionId,
  collections,
  onChange: handleChange,
}: {
  readonly collectionId: number;
  readonly collections: RA<SerializedResource<Collection>>;
  readonly onChange: (collectionId: number) => void;
}): JSX.Element {
  return (
    <Label.Generic>
      <span className={className.headerGray}>
        {schema.models.Collection.label}
      </span>
      <Select
        value={collectionId}
        onValueChange={(value): void => handleChange(Number.parseInt(value))}
      >
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.collectionName}
          </option>
        ))}
      </Select>
    </Label.Generic>
  );
}

export function CollectionAccess({
  userPolicies,
  onChange: handleChange,
  onChangedAgent: handleChangeAgent,
  collectionId,
  userAgents,
  mode,
}: {
  readonly userPolicies: IR<RA<Policy>> | undefined;
  readonly onChange: (userPolicies: IR<RA<Policy>> | undefined) => void;
  readonly onChangedAgent: () => void;
  readonly collectionId: number;
  readonly userAgents: UserAgents | undefined;
  readonly mode: FormMode;
}): JSX.Element {
  const hasCollectionAccess =
    userPolicies?.[collectionId].some(
      ({ resource, actions }) =>
        resource === collectionAccessResource && actions.includes('access')
    ) ?? false;
  const collectionAddress = userAgents?.find(({ collections }) =>
    collections.includes(collectionId)
  )?.address;

  React.useEffect(
    () =>
      typeof collectionAddress === 'object'
        ? resourceOn(collectionAddress, 'change:parent', handleChangeAgent)
        : undefined,
    [collectionAddress, handleChangeAgent]
  );

  return (
    <div className="flex flex-col gap-4">
      <Label.ForCheckbox>
        <Input.Checkbox
          isReadOnly={
            !hasPermission('/permissions/policies/user', 'update') ||
            typeof userPolicies === 'undefined'
          }
          onValueChange={
            hasPermission('/permissions/policies/user', 'update')
              ? (): void =>
                  handleChange(
                    typeof userPolicies === 'object'
                      ? replaceKey(
                          userPolicies,
                          collectionId.toString(),
                          hasCollectionAccess
                            ? userPolicies[collectionId].filter(
                                ({ resource }) =>
                                  resource !== collectionAccessResource
                              )
                            : [
                                ...userPolicies[collectionId],
                                {
                                  resource: collectionAccessResource,
                                  actions: ['access'],
                                },
                              ]
                        )
                      : undefined
                  )
              : undefined
          }
          checked={hasCollectionAccess}
        />
        {adminText('collectionAccess')}
      </Label.ForCheckbox>
      <Label.Generic>
        {schema.models.Agent.label}
        {typeof collectionAddress === 'object' ? (
          <QueryComboBox
            id={undefined}
            fieldName="agent"
            resource={collectionAddress}
            mode={mode}
            formType="form"
            isRequired={hasCollectionAccess}
            relatedModel={schema.models.Agent}
            forceCollection={collectionId}
            typeSearch={undefined}
          />
        ) : (
          <Input.Text disabled value={commonText('loading')} />
        )}
      </Label.Generic>
    </div>
  );
}

export function UserIdentityProviders({
  identityProviders,
}: {
  readonly identityProviders: IR<boolean> | undefined;
}): JSX.Element | null {
  return typeof identityProviders === 'undefined' ||
    Object.entries(identityProviders).length === 0 ? null : (
    <fieldset className="flex flex-col gap-2">
      <legend>
        <span className={className.headerGray}>
          {adminText('externalIdentityProviders')}
        </span>
      </legend>
      <Ul className="flex flex-col gap-1">
        {Object.entries(identityProviders).map(([title, isEnabled], index) => (
          <li key={index}>
            <Label.ForCheckbox>
              <Input.Checkbox isReadOnly checked={isEnabled} />
              {title}
            </Label.ForCheckbox>
          </li>
        ))}
      </Ul>
    </fieldset>
  );
}
