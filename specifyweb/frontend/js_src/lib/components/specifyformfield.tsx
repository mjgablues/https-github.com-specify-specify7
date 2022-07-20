import React from 'react';

import type { AnySchema } from '../datamodelutils';
import type { SpecifyResource } from '../legacytypes';
import type { FormMode, FormType } from '../parseform';
import type { FieldTypes, FormFieldDefinition } from '../parseformfields';
import { hasPathPermission, hasPermission } from '../permissionutils';
import type { IR } from '../types';
import { defined } from '../types';
import type { Parser } from '../uiparse';
import { getValidationAttributes } from '../uiparse';
import { Input, Textarea } from './basic';
import { ComboBox } from './combobox';
import { AutoGrowTextArea } from './common';
import { ErrorBoundary } from './errorboundary';
import { useAsyncState, useResourceValue } from './hooks';
import { usePref } from './preferenceshooks';
import { QueryComboBox } from './querycombobox';
import { getResourceAndField } from './resource';
import { PrintOnSave, SpecifyFormCheckbox } from './specifyformcheckbox';
import { UiPlugin } from './specifyformplugin';
import { UiField } from './uifield';

const fieldRenderers: {
  readonly [KEY in keyof FieldTypes]: (props: {
    readonly resource: SpecifyResource<AnySchema>;
    readonly mode: FormMode;
    readonly fieldDefinition: FieldTypes[KEY];
    readonly id: string | undefined;
    readonly isRequired: boolean;
    readonly fieldName: string | undefined;
    readonly formType: FormType;
  }) => JSX.Element | null;
} = {
  Checkbox({
    id,
    resource,
    mode,
    fieldName,
    fieldDefinition: { defaultValue, printOnSave, label },
  }) {
    return (
      <ErrorBoundary dismissable>
        {printOnSave ? (
          hasPermission('/report', 'execute') ? (
            <PrintOnSave
              defaultValue={defaultValue}
              fieldName={fieldName}
              id={id}
              model={resource.specifyModel}
              text={label}
            />
          ) : null
        ) : (
          <SpecifyFormCheckbox
            defaultValue={defaultValue}
            fieldName={defined(fieldName)}
            id={id}
            isReadOnly={mode === 'view'}
            resource={resource}
            text={label}
          />
        )}
      </ErrorBoundary>
    );
  },
  TextArea({
    id,
    resource,
    mode,
    fieldName,
    isRequired,
    fieldDefinition: { defaultValue, rows },
    formType,
  }) {
    const { value, updateValue, validationRef, parser } = useResourceValue(
      resource,
      defined(fieldName),
      React.useMemo(
        () => ({
          value: defaultValue,
          required: isRequired,
        }),
        [defaultValue, isRequired]
      )
    );

    const [validationAttributes, setAttributes] = React.useState<IR<string>>(
      {}
    );
    React.useEffect(
      () => setAttributes(getValidationAttributes(parser)),
      [parser]
    );

    const [autoGrow] = usePref('form', 'behavior', 'textAreaAutoGrow');
    const Component =
      autoGrow && formType !== 'formTable' ? AutoGrowTextArea : Textarea;

    return (
      <ErrorBoundary dismissable>
        <Component
          {...validationAttributes}
          forwardRef={validationRef}
          id={id}
          isReadOnly={mode === 'view'}
          name={fieldName}
          required={'required' in validationAttributes && mode !== 'search'}
          rows={rows}
          value={value?.toString() ?? ''}
          onBlur={(): void => updateValue(value?.toString() ?? '')}
          onValueChange={(value): void => updateValue(value, false)}
        />
      </ErrorBoundary>
    );
  },
  ComboBox({
    id,
    resource,
    mode,
    fieldName,
    isRequired,
    formType,
    fieldDefinition: { defaultValue, pickList },
  }) {
    const [data] = useAsyncState(
      React.useCallback(
        async () =>
          getResourceAndField(resource, fieldName).then(
            (values) => values ?? false
          ),
        [resource, fieldName]
      ),
      false
    );
    return (
      <ErrorBoundary dismissable>
        {data === undefined ? undefined : (
          <ComboBox
            defaultValue={defaultValue}
            field={data === false ? undefined : data.field}
            fieldName={fieldName}
            formType={formType}
            id={id}
            isDisabled={false}
            isRequired={isRequired}
            mode={mode}
            model={resource}
            pickListName={pickList}
            resource={data === false ? resource : data.resource}
          />
        )}
      </ErrorBoundary>
    );
  },
  QueryComboBox({
    id,
    resource,
    mode,
    formType,
    fieldName,
    isRequired,
    fieldDefinition: { hasCloneButton, typeSearch },
  }) {
    return typeof fieldName !== 'string' ||
      hasPathPermission(
        resource.specifyModel.name,
        fieldName.split('.'),
        'read'
      ) ? (
      <QueryComboBox
        fieldName={fieldName}
        forceCollection={undefined}
        formType={formType}
        hasCloneButton={hasCloneButton}
        id={id}
        isRequired={isRequired}
        mode={mode}
        relatedModel={undefined}
        resource={resource}
        typeSearch={typeSearch}
      />
    ) : null;
  },
  Text({
    id,
    resource,
    mode,
    fieldName,
    isRequired,
    fieldDefinition: { defaultValue, min, max, step },
  }) {
    return (
      <ErrorBoundary dismissable>
        <UiField
          fieldName={fieldName}
          id={id}
          mode={mode}
          parser={React.useMemo<Parser>(
            () => ({
              value: defaultValue,
              min,
              max,
              step,
              required: isRequired,
            }),
            [defaultValue, min, max, step, isRequired]
          )}
          resource={resource}
        />
      </ErrorBoundary>
    );
  },
  Plugin: UiPlugin,
  FilePicker({ id, mode, fieldName, isRequired }) {
    /*
     * Not sure how this is supposed to work, thus the field is rendered as
     * disabled
     *
     * Probably could overwrite the behaviour on case-by-case basis depending
     * on the fieldName
     */
    return (
      <Input.Generic
        disabled
        id={id}
        isReadOnly={mode === 'view'}
        name={fieldName}
        required={isRequired}
        type="file"
      />
    );
  },
};

export function FormField({
  mode,
  fieldDefinition: { isReadOnly, ...fieldDefinition },
  ...rest
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly mode: FormMode;
  readonly id: string | undefined;
  readonly fieldDefinition: FormFieldDefinition;
  readonly fieldName: string | undefined;
  readonly isRequired: boolean;
  readonly formType: FormType;
}): JSX.Element {
  const Render = fieldRenderers[
    fieldDefinition.type
  ] as typeof fieldRenderers.Checkbox;
  return (
    <Render
      mode={isReadOnly ? 'view' : mode}
      {...rest}
      fieldDefinition={fieldDefinition as FieldTypes['Checkbox']}
      isRequired={rest.isRequired && mode !== 'search'}
    />
  );
}
