import React from 'react';
import type { State } from 'typesafe-reducer';

import type { AnySchema } from '../datamodelutils';
import { f } from '../functools';
import { clamp } from '../helpers';
import type { SpecifyResource } from '../legacytypes';
import { commonText } from '../localization/common';
import { formsText } from '../localization/forms';
import type { Relationship } from '../specifyfield';
import type { SpecifyModel } from '../specifymodel';
import type { RA } from '../types';
import { Button, Input } from './basic';
import { Dialog } from './modaldialog';
import { SearchDialog } from './searchdialog';

export function Slider({
  value,
  count,
  onChange: handleChange,
}: {
  readonly value: number;
  readonly count: number;
  readonly onChange: (newValue: number) => void;
}): JSX.Element {
  const [isBlank, setIsBlank] = React.useState<boolean>(false);
  return (
    <div
      className={`gap-x-2 print:hidden flex justify-center ${
        count === 0 ? 'invisible' : ''
      }`}
    >
      <Button.Small
        aria-label={formsText('firstRecord')}
        title={formsText('firstRecord')}
        disabled={value == 0}
        onClick={(): void => handleChange(0)}
      >
        ≪
      </Button.Small>
      <Button.Small
        className="dark:bg-neutral-500 px-4 bg-white"
        aria-label={formsText('previousRecord')}
        title={formsText('previousRecord')}
        disabled={value == 0}
        onClick={(): void => handleChange(value - 1)}
      >
        &lt;
      </Button.Small>
      <div className="grid font-bold items-center grid-cols-[1fr_auto_1fr] gap-1">
        <label
          className={`h-full relative after:invisible after:p-2
            after:content-[attr(data-value)]`}
          data-value={value}
        >
          <span className="sr-only">{formsText('currentRecord')(count)}</span>
          <Input.Number
            className={`no-arrows dark:bg-neutral-600 absolute top-0 left-0 h-full
              font-bold bg-white border-0 text-center`}
            min="1"
            /*
             * Count is 0 when input is invisible, which causes the field to be
             * invalid (as min is 1) which inhibits form submission
             */
            max={Math.max(1, count)}
            step="1"
            // Convert 0-based indexing to 1-based
            value={isBlank ? '' : value + 1}
            onValueChange={(value): void => {
              setIsBlank(Number.isNaN(value));
              if (!Number.isNaN(value))
                handleChange(clamp(0, count - 1, value - 1));
            }}
            onBlur={(): void => setIsBlank(false)}
          />
        </label>
        <span>/</span>
        <span>{count}</span>
      </div>
      <Button.Small
        className="dark:bg-neutral-500 px-4 bg-white"
        aria-label={formsText('nextRecord')}
        title={formsText('nextRecord')}
        disabled={value + 1 == count}
        onClick={(): void => handleChange(value + 1)}
      >
        &gt;
      </Button.Small>
      <Button.Small
        aria-label={formsText('lastRecord')}
        title={formsText('lastRecord')}
        disabled={value + 1 == count}
        onClick={(): void => handleChange(count - 1)}
      >
        ≫
      </Button.Small>
    </div>
  );
}

function Search<SCHEMA extends AnySchema>({
  model,
  onAdd: handleAdd,
  onClose: handleClose,
}: {
  readonly model: SpecifyModel<SCHEMA>;
  readonly onAdd: (resource: SpecifyResource<SCHEMA>) => void;
  readonly onClose: () => void;
}): JSX.Element {
  const resource = React.useMemo(
    () =>
      new model.Resource(
        {},
        {
          noBusinessRules: true,
          noValidation: true,
        }
      ),
    [model]
  );
  return (
    <SearchDialog<SCHEMA>
      templateResource={resource}
      forceCollection={undefined}
      extraFilters={undefined}
      onSelected={(resource): void => {
        handleAdd(resource);
        handleClose();
      }}
      onClose={handleClose}
    />
  );
}

export type RecordSelectorProps<SCHEMA extends AnySchema> = {
  readonly model: SpecifyModel<SCHEMA>;
  // Related field
  readonly field?: Relationship;
  // A record on which this record set is dependent
  readonly relatedResource?: SpecifyResource<AnySchema>;
  // List of record set items
  readonly records: RA<SpecifyResource<SCHEMA> | undefined>;
  // Callback to call when new record needs to be added to the record set
  readonly onAdd: undefined | ((resource: SpecifyResource<SCHEMA>) => void);
  // Callback to call when new record needs to be added to the record set
  readonly onDelete: undefined | ((index: number) => void);
  readonly defaultIndex?: number;
  // Render function. Allows to customize placement of elements and features
  readonly children: (props: {
    // Delete confirmation or search dialogs
    readonly dialogs: JSX.Element;
    // Record Selector slider component
    readonly slider: JSX.Element;
    // Index of current resource in the RecordSet
    readonly index: number;
    // Readonly resourceView: JSX.Element | undefined;
    readonly totalCount: number;
    // Use this to render <ResourceView>
    readonly resource: SpecifyResource<SCHEMA> | undefined;
    // Set this as an "Add" button event listener
    readonly onAdd: () => void;
    // Set this as an "Remove" button event listener
    readonly onRemove: () => Promise<boolean>;
    // True while fetching new record
    readonly isLoading: boolean;
  }) => JSX.Element;
  // Current index in the collection
  readonly index: number;
  // Event handler for index change
  readonly onSlide: (newIndex: number) => void;
  // Total number of elements in the collection
  readonly totalCount: number;
};

export function BaseRecordSelector<SCHEMA extends AnySchema>({
  model,
  field,
  records,
  onAdd: handleAdded,
  onDelete: handleDelete,
  relatedResource,
  children,
  index,
  onSlide: handleSlide,
  totalCount,
}: RecordSelectorProps<SCHEMA>): JSX.Element {
  const lastIndexRef = React.useRef<number>(index);
  React.useEffect(
    () => (): void => {
      lastIndexRef.current = index;
    },
    [index]
  );

  const [state, setState] = React.useState<
    | State<'main'>
    | State<
        'deleteDialog',
        { readonly handleDeleted: (result: boolean) => void }
      >
    | State<'addBySearch'>
  >({ type: 'main' });

  function handleAdd(): void {
    if (typeof handleAdded === 'undefined') return;

    if (typeof relatedResource === 'object') {
      const resource = new model.Resource();
      if (typeof field?.otherSideName === 'string' && !relatedResource.isNew())
        resource.set(field.otherSideName, relatedResource.url() as any);
      handleAdded(resource);
      handleSlide(totalCount);
    } else setState({ type: 'addBySearch' });
  }

  async function handleRemove(): Promise<boolean> {
    if (records.length === 0 || typeof handleDelete === 'undefined')
      return false;
    const handleDeleted = (): void =>
      handleSlide(Math.min(index, totalCount - 2));

    if (typeof relatedResource === 'object') {
      handleDeleted();
      handleDelete(index);
      return true;
    } else {
      let resolveCallback: (result: boolean) => void;
      const promise = new Promise<boolean>((resolve) => {
        resolveCallback = resolve;
      });
      setState({
        type: 'deleteDialog',
        handleDeleted(result: boolean) {
          resolveCallback(result);
          handleDeleted();
        },
      });
      return promise;
    }
  }

  return children({
    slider: (
      <Slider
        value={
          typeof records[index] === 'object' ? index : lastIndexRef.current
        }
        count={totalCount}
        onChange={handleSlide}
      />
    ),
    index,
    totalCount,
    isLoading: typeof records[index] === 'undefined',
    // While new resource is loading, display previous resource
    resource: records[index] ?? records[lastIndexRef.current],
    dialogs: (
      <>
        {state.type === 'deleteDialog' ? (
          <Dialog
            title={field?.label ?? model?.label}
            header={formsText('removeRecordDialogHeader')}
            onClose={(): void => {
              state.handleDeleted(false);
              setState({ type: 'main' });
            }}
            buttons={
              <>
                <Button.Red
                  onClick={(): void => {
                    state.handleDeleted(true);
                    setState({ type: 'main' });
                  }}
                >
                  {commonText('delete')}
                </Button.Red>
                <Button.DialogClose>{commonText('cancel')}</Button.DialogClose>
              </>
            }
          >
            {formsText('removeRecordDialogText')}
          </Dialog>
        ) : state.type === 'addBySearch' &&
          typeof handleAdded === 'function' ? (
          <Search
            model={model}
            onAdd={(record): void => {
              f.maybe(field?.otherSideName, (fieldName) =>
                f.maybe(relatedResource?.url(), (url) =>
                  record.set(fieldName, url as never)
                )
              );
              handleAdded(record);
              handleSlide(totalCount);
            }}
            onClose={(): void => setState({ type: 'main' })}
          />
        ) : undefined}
      </>
    ),
    onAdd: handleAdd,
    onRemove: handleRemove,
  });
}
