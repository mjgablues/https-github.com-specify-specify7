import React from 'react';

import type { PickList } from '../datamodel';
import type { AnySchema } from '../datamodelutils';
import { f } from '../functools';
import type { SpecifyResource } from '../legacytypes';
import { commonText } from '../localization/common';
import { formsText } from '../localization/forms';
import { queryText } from '../localization/query';
import { hasToolPermission } from '../permissions';
import { PickListTypes } from '../picklistmixins';
import { getResourceApiUrl, resourceOn } from '../resource';
import { schema } from '../schema';
import type { RA } from '../types';
import { Autocomplete } from './autocomplete';
import { Button, Select } from './basic';
import type { DefaultComboBoxProps, PickListItemSimple } from './combobox';
import { LoadingContext } from './contexts';
import { useValidation } from './hooks';
import { Dialog } from './modaldialog';
import { useSaveBlockers, useValidationAttributes } from './resource';

export function PickListComboBox(
  props: DefaultComboBoxProps & {
    readonly items: RA<PickListItemSimple> | undefined;
    // This may be undefined for front-end only picklists
    readonly pickList: SpecifyResource<PickList> | undefined;
    // Pick list is considered read only if onAdd is undefined
    readonly onAdd?: (value: string) => void;
  }
): JSX.Element {
  const getValue = React.useCallback(() => {
    const value = props.resource.get(props.field.name);
    return typeof value === 'object'
      ? (value as SpecifyResource<AnySchema>)?.url() ?? null
      : (value as string | number)?.toString() ?? null;
  }, [props.resource, props.field?.name]);

  const [value, setValue] = React.useState<string | null>(getValue);

  const validationAttributes = useValidationAttributes(props.field);
  const updateValue = React.useCallback(
    (value: string): void =>
      void props.resource.set(
        props.field.name,
        (value === '' && !props.isRequired
          ? null
          : validationAttributes?.type === 'number'
          ? f.parseInt(value) ?? null
          : value) as never
      ),
    [props.field.name, validationAttributes, props.isRequired, props.resource]
  );

  const relatedModel = props.field.isRelationship
    ? props.field.relatedModel.name
    : undefined;
  const items = React.useMemo(
    () =>
      typeof relatedModel === 'string'
        ? props.items?.map((item) =>
            typeof f.parseInt(item.value) === 'number'
              ? {
                  ...item,
                  value: getResourceApiUrl(relatedModel, item.value),
                }
              : item
          )
        : props.items,
    [props.items, relatedModel]
  );

  // Listen for changes to the field
  React.useEffect(() => {
    void props.resource.businessRuleMgr?.checkField(props.field.name);
    return resourceOn(props.resource, `change:${props.field.name}`, (): void =>
      setValue(getValue)
    );
  }, [props.resource, props.field.name, getValue]);

  // Set default value
  React.useEffect(() => {
    if (
      props.resource.isNew() &&
      typeof props.defaultValue === 'string' &&
      Array.isArray(items) &&
      !Boolean(props.resource.get(props.field.name))
    ) {
      const defaultItem =
        items.find(({ value }) => value === props.defaultValue) ??
        items.find(({ title }) => title === props.defaultValue);
      if (typeof defaultItem === 'object') updateValue(defaultItem.value);
      else
        console.warn(
          'default value for picklist is not a member of the picklist',
          [items, props.resource, props.defaultValue]
        );
    }
  }, [items, props.resource, props.defaultValue, updateValue]);

  // Warn on duplicates
  React.useEffect(() => {
    const values = items?.map(({ value }) => value) ?? [];
    if (values.length !== new Set(values).size)
      console.error('Duplicate picklist entries found', [
        items,
        props.resource,
      ]);
  }, [items, props.resource]);

  const errors = useSaveBlockers({
    resource: props.model,
    fieldName: props.field.name,
  });
  const isRemote = props.resource !== props.model;
  const { validationRef } = useValidation(isRemote ? '' : errors);

  const [pendingNewValue, setPendingNewValue] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(
    () =>
      typeof pendingNewValue === 'string' &&
      items?.some(({ value }) => value === pendingNewValue) === true
        ? updateValue(pendingNewValue)
        : undefined,
    [items, pendingNewValue, updateValue]
  );

  function addNewValue(value: string): void {
    if (props.pickList?.get('type') === PickListTypes.FIELDS)
      updateValue(value);
    else if (props.pickList?.get('type') === PickListTypes.ITEMS)
      setPendingNewValue(value);
    else throw new Error('adding item to wrong type of picklist');
  }

  const currentValue = items?.find((item) => item.value === value);
  const isExistingValue =
    typeof items === 'undefined' || typeof currentValue === 'object';

  const autocompleteItems = React.useMemo(
    () =>
      items
        ?.filter(({ value }) => Boolean(value))
        .map((item) => ({
          label: item.title,
          data: item.value,
        })) ?? [],
    [items]
  );

  const handleAdd = hasToolPermission('pickLists', 'create')
    ? props.onAdd
    : undefined;

  const isDisabled = props.isDisabled || typeof items === 'undefined';
  const isRequired =
    ('required' in validationAttributes || props.isRequired) &&
    props.mode !== 'search';
  const name = props.pickList?.get('name') ?? props.pickListName;

  return (
    <>
      {typeof handleAdd === 'undefined' || isDisabled ? (
        <Select
          id={props.id}
          // "null" value is represented as an empty string
          value={value ?? ''}
          {...validationAttributes}
          required={isRequired}
          onValueChange={(newValue): void =>
            newValue === ''
              ? updateValue('')
              : items?.some(({ value }) => value === newValue) === true
              ? updateValue(newValue)
              : undefined
          }
          name={name}
          disabled={isDisabled || props.mode === 'view'}
        >
          {isExistingValue ? (
            isRequired ? undefined : (
              <option key="nullValue" />
            )
          ) : value === null ? (
            <option key="nullValue" />
          ) : (
            <option key="invalidValue">
              {queryText('invalidPicklistValue', value)}
            </option>
          )}
          {items?.map(({ title, value }) => (
            // If pick list has duplicate values, this triggers React warnings
            <option key={value} value={value}>
              {title}
            </option>
          ))}
        </Select>
      ) : (
        <Autocomplete<string>
          filterItems={true}
          source={autocompleteItems}
          onNewValue={f.var(props.pickList?.get('sizeLimit'), (sizeLimit) =>
            typeof sizeLimit === 'number' &&
            sizeLimit > 0 &&
            sizeLimit <= autocompleteItems.length
              ? undefined
              : addNewValue
          )}
          onChange={({ data }): void => updateValue(data)}
          onCleared={(): void => updateValue('')}
          forwardRef={validationRef}
          aria-label={undefined}
          value={(currentValue?.title || value) ?? ''}
          disabled={isDisabled || props.mode === 'view'}
          inputProps={{
            id: props.id,
            name,
            required: isRequired,
          }}
        />
      )}
      {typeof pendingNewValue === 'string' &&
        typeof props.pickList === 'object' &&
        typeof handleAdd === 'function' && (
          <AddingToPicklist
            type={validationAttributes.type ?? 'string'}
            value={pendingNewValue}
            pickList={props.pickList}
            onAdd={(): void => {
              handleAdd?.(pendingNewValue);
              updateValue(pendingNewValue);
            }}
            onClose={(): void => setPendingNewValue(undefined)}
          />
        )}
    </>
  );
}

function AddingToPicklist({
  type,
  value,
  pickList,
  onAdd: handleAdd,
  onClose: handleClose,
}: {
  readonly type: string;
  readonly value: string;
  readonly pickList: SpecifyResource<PickList>;
  readonly onAdd: () => void;
  readonly onClose: () => void;
}): JSX.Element {
  const loading = React.useContext(LoadingContext);
  const isInvalidNumeric = type === 'number' && f.parseInt(value) === undefined;
  return isInvalidNumeric ? (
    <Dialog
      header={formsText('invalidType')}
      onClose={handleClose}
      buttons={commonText('close')}
    >
      {formsText('invalidNumericPicklistValue')}
    </Dialog>
  ) : (
    <Dialog
      header={formsText('addToPickListConfirmationDialogHeader')}
      onClose={handleClose}
      buttons={
        <>
          <Button.Green
            onClick={(): void =>
              loading(
                pickList
                  .rgetCollection('pickListItems')
                  .then(async (items) => {
                    const item = new schema.models.PickListItem.Resource();
                    item.set('title', value);
                    item.set('value', value);
                    items.add(item);
                    return pickList.save();
                  })
                  .then(handleClose)
                  .then(handleAdd)
              )
            }
          >
            {commonText('add')}
          </Button.Green>
          <Button.DialogClose>{commonText('cancel')}</Button.DialogClose>
        </>
      }
    >
      {formsText(
        'addToPickListConfirmationDialogText',
        value,
        pickList.get('name')
      )}
    </Dialog>
  );
}
