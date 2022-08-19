import React from 'react';

import type { AnySchema } from '../datamodelutils';
import type { SpecifyResource } from '../legacytypes';
import type { SpecifyModel } from '../specifymodel';
import { Input, Label } from './basic';
import { useResourceValue } from './useresourcevalue';
import { useCachedState } from './statecache';

export function PrintOnSave({
  id,
  fieldName,
  model,
  text,
  defaultValue,
}: {
  readonly id: string | undefined;
  readonly fieldName: string | undefined;
  readonly model: SpecifyModel;
  readonly text: string | undefined;
  readonly defaultValue: boolean | undefined;
}): JSX.Element {
  const [tables, setTables] = useCachedState('forms', 'printOnSave');
  /*
   * Need to check for object explicitly, because this cache key stored
   * boolean in the past
   */
  const entry = typeof tables === 'object' ? tables[model.name] : undefined;
  const checked =
    entry === true || (entry === undefined && defaultValue === true);
  const input = (
    <Input.Checkbox
      checked={checked}
      id={id}
      name={fieldName}
      onValueChange={(checked): void =>
        setTables({
          ...(typeof tables === 'object' ? tables : {}),
          [model.name]: checked,
        })
      }
    />
  );
  return typeof text === 'string' ? (
    <Label.ForCheckbox
      title={model.getField(fieldName ?? '')?.getLocalizedDesc()}
    >
      {input}
      {text}
    </Label.ForCheckbox>
  ) : (
    input
  );
}

export function SpecifyFormCheckbox({
  id,
  resource,
  fieldName,
  defaultValue,
  isReadOnly,
  text,
}: {
  readonly id: string | undefined;
  readonly resource: SpecifyResource<AnySchema>;
  readonly fieldName: string;
  readonly defaultValue: boolean | undefined;
  readonly isReadOnly: boolean;
  readonly text: string | undefined;
}): JSX.Element {
  const { value, updateValue, validationRef } = useResourceValue<boolean>(
    resource,
    fieldName,
    React.useMemo(() => ({ value: defaultValue }), [defaultValue])
  );
  const input = (
    <Input.Checkbox
      checked={value ?? false}
      forwardRef={validationRef}
      id={id}
      isReadOnly={
        isReadOnly || resource.specifyModel.getField(fieldName)?.isReadOnly
      }
      name={fieldName}
      onValueChange={updateValue}
      // Checkbox cannot be required as checkbox does not have a "null" state
    />
  );
  return typeof text === 'string' ? (
    <Label.ForCheckbox
      title={resource.specifyModel
        .getField(fieldName ?? '')
        ?.getLocalizedDesc()}
    >
      {input}
      {text}
    </Label.ForCheckbox>
  ) : (
    input
  );
}
