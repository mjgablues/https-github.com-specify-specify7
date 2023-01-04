import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import { f } from '../../utils/functools';
import type { GetOrSet, RA } from '../../utils/types';
import { Button } from '../Atoms/Button';
import type { AnySchema } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { Relationship } from '../DataModel/specifyField';
import type { SpecifyModel } from '../DataModel/specifyModel';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { TableIcon } from '../Molecules/TableIcon';
import { format } from './dataObjFormatters';
import { ResourceView } from './ResourceView';
import { Ul } from '../Atoms';
import { idFromUrl } from '../DataModel/resource';

export type DeleteBlocker = {
  readonly model: SpecifyModel;
  readonly field: string;
  readonly id: number;
};

export function DeleteBlockers({
  resource: parentResource,
  blockers,
  expand = false,
  onClose: handleClose,
  onDeleted: handleDeleted,
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly blockers: RA<DeleteBlocker>;
  readonly expand?: boolean;
  readonly onClose: (() => void) | undefined;
  readonly onDeleted: () => void;
}): JSX.Element | null {
  const [preview, setPreview] = React.useState<
    | {
        readonly resource: SpecifyResource<AnySchema>;
        readonly field: Relationship | undefined;
      }
    | undefined
  >(undefined);

  const isEmbedded = handleClose === undefined;
  const [data, setData] = useFormattedBlockers(
    parentResource,
    blockers,
    !isEmbedded
  );

  React.useEffect(
    () =>
      Array.isArray(data) && data.length === 0 ? handleDeleted() : undefined,
    [data, handleDeleted]
  );

  if (!Array.isArray(data)) return null;
  else if (typeof preview === 'object')
    return (
      <BlockerPreview
        field={preview.field}
        parentResource={parentResource}
        resource={preview.resource}
        onClose={(): void => setPreview(undefined)}
        onDeleted={(): void =>
          setData(data.filter(({ resource }) => resource !== preview.resource))
        }
      />
    );
  const children = data.map(({ formatted, field, resource }, index) => {
    const fieldName = typeof field === 'object' ? field.name : field;
    const fieldLabel = typeof field === 'object' ? field.label : field;
    const button = (
      <Button.LikeLink
        // BUG: consider applying these styles everywhere
        className="max-w-full overflow-auto text-left"
        onClick={(): void =>
          setPreview({
            resource,
            field: typeof field === 'object' ? field : undefined,
          })
        }
      >
        <TableIcon label name={resource.specifyModel.name} />
        {formatted}
      </Button.LikeLink>
    );
    return isEmbedded ? (
      <li key={index}>
        {button}
        {expand && (
          <DependentResources fieldName={fieldName} resource={resource} />
        )}
      </li>
    ) : (
      <tr key={index}>
        <td>{button}</td>
        <td>{fieldLabel}</td>
      </tr>
    );
  });
  return isEmbedded ? (
    <Ul className={expand ? undefined : 'pl-4'}>{children}</Ul>
  ) : (
    <Dialog
      buttons={commonText.close()}
      className={{
        container: dialogClassNames.wideContainer,
      }}
      header={formsText.deleteBlocked()}
      onClose={handleClose}
    >
      {formsText.deleteBlockedDescription()}
      {/* BUG: apply these styles everywhere where necessary */}
      <table className="grid-table grid-cols-[minmax(0,1fr),auto] gap-2">
        <thead>
          <tr>
            <th scope="col">{formsText.record()}</th>
            <th scope="col">{formsText.relationship()}</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </Dialog>
  );
}

export function useFormattedBlockers(
  parentResource: SpecifyResource<AnySchema>,
  blockers: RA<DeleteBlocker> | undefined,
  loadingScreen: boolean
): GetOrSet<
  | RA<{
      readonly field: Relationship | string;
      readonly resource: SpecifyResource<AnySchema>;
      readonly formatted: string;
    }>
  | undefined
> {
  return useAsyncState(
    React.useCallback(
      async () =>
        blockers === undefined
          ? undefined
          : Promise.all(
              blockers.map(async ({ model, field, id }) => {
                const resource = new model.Resource({ id });
                return f.all({
                  field: model.getRelationship(field) ?? field,
                  resource,
                  formatted: (await format(resource, undefined, true))!,
                });
              })
            ),
      [parentResource, blockers]
    ),
    loadingScreen
  );
}

const importantRelationships = (model: SpecifyModel): RA<Relationship> =>
  model.relationships.filter(
    (relationship) =>
      relationship.otherSideName !== undefined && !relationship.isDependent()
  );

function DependentResources({
  fieldName,
  resource,
}: {
  readonly fieldName: string;
  readonly resource: SpecifyResource<AnySchema>;
}): JSX.Element {
  const dependent = React.useMemo(
    () =>
      importantRelationships(resource.specifyModel)
        .filter(({ name }) => name !== fieldName)
        .map((relationship) => ({
          model: relationship.relatedModel,
          field: relationship.name,
          id: f.maybe(resource.get(relationship.name), idFromUrl)!,
        }))
        .filter(({ id }) => typeof id === 'number'),
    [resource]
  );
  return (
    <DeleteBlockers
      resource={resource}
      blockers={dependent}
      onDeleted={f.void}
      onClose={undefined}
    />
  );
}

function BlockerPreview({
  resource,
  parentResource,
  field,
  onClose: handleClose,
  onDeleted: handleDeleted,
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly parentResource: SpecifyResource<AnySchema>;
  readonly field: Relationship | undefined;
  readonly onClose: () => void;
  readonly onDeleted: () => void;
}): JSX.Element {
  return (
    <ResourceView
      dialog="modal"
      isDependent={false}
      isSubForm={false}
      mode="edit"
      resource={resource}
      onAdd={undefined}
      onClose={handleClose}
      onDeleted={(): void => {
        handleDeleted();
        handleClose();
      }}
      onSaved={(): void => {
        if (
          typeof field === 'object' &&
          resource.get(field.name) !== parentResource.get('resource_uri')
        )
          handleDeleted();
        handleClose();
      }}
    />
  );
}
