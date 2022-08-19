import React from 'react';

import type { AnySchema } from '../datamodelutils';
import { aggregate, format } from '../dataobjformatters';
import { f } from '../functools';
import type { SpecifyResource } from '../legacytypes';
import { commonText } from '../localization/common';
import type { FormMode } from '../parseform';
import { hasPathPermission, hasTablePermission } from '../permissionutils';
import { QueryFieldSpec } from '../queryfieldspec';
import { parseRelativeDate } from '../relativedate';
import type { LiteralField, Relationship } from '../specifyfield';
import type { Collection } from '../specifymodel';
import type { IR } from '../types';
import type { Parser } from '../uiparse';
import {
  getValidationAttributes,
  mergeParsers,
  parserFromType,
} from '../uiparse';
import { relationshipIsToMany } from '../wbplanviewmappinghelper';
import { Input } from './basic';
import { useAsyncState } from './hooks';
import { useResourceValue } from './useresourcevalue';
import { PartialDateUi } from './partialdateui';
import { usePref } from './preferenceshooks';
import { getResourceAndField } from './resource';
import { SpecifyFormCheckbox } from './specifyformcheckbox';

export function UiField({
  id,
  resource,
  mode,
  fieldName,
  parser,
}: {
  readonly id: string | undefined;
  readonly resource: SpecifyResource<AnySchema>;
  readonly mode: FormMode;
  readonly fieldName: string | undefined;
  readonly parser?: Parser;
}): JSX.Element {
  const hasAccess = React.useMemo(
    () =>
      typeof fieldName !== 'string' ||
      hasPathPermission(
        resource.specifyModel.name,
        fieldName.split('.'),
        'read'
      ),
    [resource.specifyModel.name, fieldName]
  );

  const [data] = useAsyncState(
    React.useCallback(
      async () =>
        hasAccess ? getResourceAndField(resource, fieldName) : undefined,
      [resource, fieldName]
    ),
    false
  );

  /*
   * If tried to render a -to-many field, display a readOnly aggregated
   * collection
   */
  const [aggregated] = useAsyncState(
    React.useCallback(
      async () =>
        hasAccess && typeof data === 'object' && typeof fieldName === 'string'
          ? 'models' in data.resource
            ? aggregate(data.resource as unknown as Collection<AnySchema>)
            : QueryFieldSpec.fromPath(
                resource.specifyModel.name,
                fieldName.split('.')
              ).joinPath.some(
                (field) => field.isRelationship && relationshipIsToMany(field)
              )
            ? data.resource.rgetCollection(data.field.name).then(aggregate)
            : false
          : undefined,
      [hasAccess, resource.specifyModel.name, data, fieldName]
    ),
    false
  );

  const fieldType = React.useMemo(
    () =>
      typeof data === 'object' && !data.field.isRelationship
        ? parserFromType(data.field.type).type
        : undefined,
    [data]
  );

  const defaultDate = React.useMemo(
    () =>
      f.maybe(
        parser?.value?.toString().trim().toLowerCase(),
        parseRelativeDate
      ),
    [parser?.value]
  );

  return hasAccess ? (
    data === undefined ? (
      <Input.Text disabled id={id} value={aggregated?.toString() ?? ''} />
    ) : fieldType === 'date' ? (
      <PartialDateUi
        canChangePrecision={false}
        dateField={data.field.name}
        defaultPrecision="full"
        defaultValue={defaultDate}
        id={id}
        isReadOnly={mode === 'view' || data.resource !== resource}
        precisionField={undefined}
        resource={data.resource}
      />
    ) : fieldType === 'checkbox' ? (
      <SpecifyFormCheckbox
        defaultValue={
          parser?.value === true ||
          // Not sure if this branch can ever happen:
          parser?.value?.toString().toLowerCase() === 'true'
        }
        fieldName={data.field.name}
        id={id}
        isReadOnly={resource !== data.resource}
        resource={data.resource}
        text={undefined}
      />
    ) : aggregated === false ? (
      <Field
        field={data.field}
        id={id}
        mode={mode}
        model={resource}
        parser={parser}
        resource={data.resource}
      />
    ) : (
      <Input.Text disabled id={id} value={aggregated?.toString() ?? ''} />
    )
  ) : (
    <Input.Text disabled id={id} value={commonText('noPermission')} />
  );
}

export function Field({
  id,
  resource,
  model,
  mode,
  field,
  parser: defaultParser,
}: {
  readonly id: string | undefined;
  readonly resource: SpecifyResource<AnySchema>;
  readonly model?: SpecifyResource<AnySchema>;
  readonly mode: FormMode;
  readonly field: LiteralField | Relationship | undefined;
  readonly parser?: Parser;
}): JSX.Element {
  const { value, updateValue, validationRef, parser } = useResourceValue(
    resource,
    field?.name,
    defaultParser
  );

  const [validationAttributes, setAttributes] = React.useState<IR<string>>({});
  React.useEffect(
    () =>
      setAttributes(
        getValidationAttributes(mergeParsers(parser, defaultParser ?? {}))
      ),
    [parser, defaultParser]
  );

  const isReadOnly =
    mode === 'view' ||
    resource !== model ||
    field?.isRelationship === true ||
    (field?.isReadOnly === true && mode !== 'search');

  const [formattedRelationship] = useAsyncState(
    React.useCallback(
      () =>
        field?.isRelationship === true
          ? hasTablePermission(field.relatedModel.name, 'read')
            ? (
                resource.rgetPromise(field.name) as Promise<
                  SpecifyResource<AnySchema> | undefined
                >
              )
                .then(format)
                .then((value) => value ?? '')
            : commonText('noPermission')
          : undefined,
      /*
       * While "value" is not used in the hook, it is needed to update a
       * formatter if related resource changes
       */
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [resource, field, value]
    ),
    false
  );

  const [rightAlignNumberFields] = usePref(
    'form',
    'ui',
    'rightAlignNumberFields'
  );
  return (
    <Input.Generic
      forwardRef={validationRef}
      name={field?.name}
      {...validationAttributes}
      // This is undefined when resource.noValidation = true
      className={
        validationAttributes.type === 'number' &&
        rightAlignNumberFields &&
        globalThis.navigator.userAgent.toLowerCase().includes('webkit')
          ? `text-right ${isReadOnly ? '' : 'pr-6'}`
          : ''
      }
      id={id}
      isReadOnly={isReadOnly}
      /*
       * Update data model value before onBlur, as onBlur fires after onSubmit
       * if form is submitted using the ENTER key
       */
      required={'required' in validationAttributes && mode !== 'search'}
      tabIndex={isReadOnly ? -1 : undefined}
      type={validationAttributes.type ?? 'text'}
      /*
       * Disable "text-align: right" in non webkit browsers
       * as they don't support spinner's arrow customization
       */
      value={
        field?.isRelationship === true
          ? formattedRelationship ?? commonText('loading')
          : value?.toString() ?? ''
      }
      onBlur={
        isReadOnly ? undefined : ({ target }): void => updateValue(target.value)
      }
      onChange={(event): void => {
        const input = event.target as HTMLInputElement;
        /*
         * Don't show validation errors on value change for input fields until
         * field is blurred, unless user tried to paste a date (see definition
         * of Input.Generic)
         */
        updateValue(input.value, event.type === 'paste');
      }}
    />
  );
}
