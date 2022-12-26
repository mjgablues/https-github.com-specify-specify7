import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import { useBooleanState } from '../../hooks/useBooleanState';
import { commonText } from '../../localization/common';
import { queryText } from '../../localization/query';
import { f } from '../../utils/functools';
import type { RA } from '../../utils/types';
import { Button } from '../Atoms/Button';
import type { AnySchema } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { DeleteBlocker } from '../Forms/DeleteBlocked';
import { DeleteBlockers } from '../Forms/DeleteBlocked';
import { fetchBlockers } from '../Forms/DeleteButton';
import { ResourceView } from '../Forms/ResourceView';
import { DateElement } from '../Molecules/DateElement';
import { dialogClassNames } from '../Molecules/Dialog';
import { FormattedResource } from '../Molecules/FormattedResource';
import { TableIcon } from '../Molecules/TableIcon';

export function MergingHeader({
  merged,
  resources,
  onDeleted: handleDeleted,
}: {
  readonly merged: SpecifyResource<AnySchema>;
  readonly resources: RA<SpecifyResource<AnySchema>>;
  readonly onDeleted: (id: number) => void;
}): JSX.Element {
  return (
    <>
      <HeaderLine merged={merged} resources={resources} />
      <tbody>
        <SummaryLines merged={merged} resources={resources} />
        <UsagesLine resources={resources} />
        <PreviewLine
          merged={merged}
          resources={resources}
          onDeleted={handleDeleted}
        />
      </tbody>
    </>
  );
}

const background = dialogClassNames.solidBackground;

function HeaderLine({
  merged,
  resources,
}: {
  readonly merged: SpecifyResource<AnySchema>;
  readonly resources: RA<SpecifyResource<AnySchema>>;
}): JSX.Element {
  return (
    <thead>
      <tr>
        <td className={background} />
        {[merged, ...resources].map((resource, index) => (
          <th
            className={`sticky top-0 ${background} z-[20]`}
            key={index}
            scope="col"
          >
            <TableIcon label name={resource.specifyModel.name} />
            <FormattedResource asLink={false} resource={resource} />
          </th>
        ))}
      </tr>
    </thead>
  );
}

function SummaryLines({
  merged,
  resources,
}: {
  readonly merged: SpecifyResource<AnySchema>;
  readonly resources: RA<SpecifyResource<AnySchema>>;
}): JSX.Element {
  const createdField = merged.specifyModel.getField('timestampCreated');
  const modifiedField = merged.specifyModel.getField('timestampModified');
  return (
    <>
      {typeof createdField === 'object' && (
        <MergeRow header={createdField.label}>
          {[merged, ...resources].map((resource, index) => (
            <td key={index}>
              <DateElement date={resource.get('timestampCreated')} flipDates />
            </td>
          ))}
        </MergeRow>
      )}
      {typeof modifiedField === 'object' && (
        <MergeRow header={modifiedField.label}>
          {[merged, ...resources].map((resource, index) => (
            <td key={index}>
              <DateElement date={resource.get('timestampModified')} flipDates />
            </td>
          ))}
        </MergeRow>
      )}
    </>
  );
}

export function MergeRow({
  header,
  children,
}: {
  readonly header: string;
  readonly children: React.ReactNode;
}): JSX.Element {
  return (
    <tr>
      <th
        className={`sticky left-0 text-left ${background} z-[10]`}
        scope="row"
      >
        {header}
      </th>
      {children}
    </tr>
  );
}

function UsagesLine({
  resources,
}: {
  readonly resources: RA<SpecifyResource<AnySchema>>;
}): JSX.Element {
  return (
    <MergeRow header={queryText('referencesToRecord')}>
      <td>{commonText('notApplicable')}</td>
      {resources.map((resource, index) => (
        <ResourceBlockers key={index} resource={resource} />
      ))}
    </MergeRow>
  );
}

function ResourceBlockers({
  resource,
}: {
  readonly resource: SpecifyResource<AnySchema>;
}): JSX.Element {
  const [blockers] = useAsyncState<RA<DeleteBlocker>>(
    React.useCallback(async () => fetchBlockers(resource), [resource]),
    false
  );
  return (
    <td className="flex-col !items-start">
      {blockers === undefined ? (
        commonText('loading')
      ) : (
        <DeleteBlockers
          blockers={blockers}
          resource={resource}
          onClose={undefined}
          onDeleted={f.void}
        />
      )}
    </td>
  );
}

// FIXME: display number in dialog heading
function PreviewLine({
  merged,
  resources,
  onDeleted: handleDeleted,
}: {
  readonly merged: SpecifyResource<AnySchema>;
  readonly resources: RA<SpecifyResource<AnySchema>>;
  readonly onDeleted: (id: number) => void;
}): JSX.Element {
  return (
    <MergeRow header={queryText('preview')}>
      {[merged, ...resources].map((resource, index) => (
        <RecordPreview
          index={index}
          key={index}
          resource={resource}
          onDeleted={(): void => handleDeleted(resource.id)}
        />
      ))}
    </MergeRow>
  );
}

function RecordPreview({
  resource,
  index,
  onDeleted: handleDeleted,
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly index: number;
  readonly onDeleted: () => void;
}): JSX.Element {
  const [isOpen, _, handleClose, handleToggle] = useBooleanState(false);

  return (
    <td>
      <Button.Gray
        aria-pressed={isOpen}
        onClick={handleToggle}
        className="flex-1"
      >
        {index === 0
          ? queryText('previewMerged')
          : `${queryText('preview')} ${index}`}
      </Button.Gray>
      {isOpen && (
        <ResourceView
          dialog="nonModal"
          isDependent={false}
          isSubForm={false}
          mode="view"
          resource={resource}
          onAdd={undefined}
          onClose={handleClose}
          onDeleted={handleDeleted}
          onSaved={undefined}
        />
      )}
    </td>
  );
}
