import React from 'react';

import { useDistantRelated } from '../../hooks/resource';
import { useAsyncState } from '../../hooks/useAsyncState';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import { f } from '../../utils/functools';
import type { ValueOf } from '../../utils/types';
import { DataEntry } from '../Atoms/DataEntry';
import { backboneFieldSeparator, toTable } from '../DataModel/helpers';
import type { AnySchema } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import { resourceOn } from '../DataModel/resource';
import { schema } from '../DataModel/schema';
import type { Collection } from '../DataModel/specifyModel';
import { UiCommand } from '../FormCommands';
import { FormField } from '../FormFields';
import type { FormMode, FormType } from '../FormParse';
import { fetchView, resolveViewDefinition } from '../FormParse';
import type {
  cellAlign,
  CellTypes,
  cellVerticalAlign,
} from '../FormParse/cells';
import { SpecifyForm } from '../Forms/SpecifyForm';
import { SubView } from '../Forms/SubView';
import { TableIcon } from '../Molecules/TableIcon';
import { PickListTypes } from '../PickLists/definitions';
import { relationshipIsToMany } from '../WbPlanView/mappingHelpers';
import { FormTableInteraction } from './FormTableInteraction';
import { PickListEditor } from './PickListEditor';

const cellRenderers: {
  readonly [KEY in keyof CellTypes]: (props: {
    readonly mode: FormMode;
    readonly cellData: CellTypes[KEY];
    readonly id: string | undefined;
    readonly formatId: (id: string) => string;
    readonly resource: SpecifyResource<AnySchema>;
    readonly formType: FormType;
    readonly align: typeof cellAlign[number];
    readonly verticalAlign: typeof cellVerticalAlign[number];
  }) => JSX.Element | null;
} = {
  Field({
    mode,
    cellData: { fieldDefinition, fieldNames, isRequired },
    id,
    formatId,
    resource,
    formType,
  }) {
    const fields = React.useMemo(
      () =>
        resource.specifyModel.getFields(
          fieldNames?.join(backboneFieldSeparator) ?? ''
        ),
      [resource.specifyModel, fieldNames]
    );
    return (
      <FormField
        fieldDefinition={fieldDefinition}
        fields={fields}
        formType={formType}
        id={typeof id === 'string' ? formatId(id.toString()) : undefined}
        isRequired={isRequired}
        mode={mode}
        resource={resource}
      />
    );
  },
  Label({ cellData: { text, labelForCellId, title }, formatId, align }) {
    const style: React.CSSProperties = {
      textAlign:
        align === 'right' ? 'right' : align === 'center' ? 'center' : undefined,
    };
    return typeof text === 'string' &&
      text.length === 0 ? null : typeof labelForCellId === 'string' ? (
      <label htmlFor={formatId(labelForCellId)} style={style} title={title}>
        {text}
      </label>
    ) : (
      <p style={style} title={title}>
        {text}
      </p>
    );
  },
  Separator({ cellData: { label, icon, forClass } }) {
    return typeof label === 'string' || typeof forClass === 'string' ? (
      <DataEntry.SubFormTitle
        className="border-b border-gray-500"
        title={
          typeof forClass === 'string'
            ? schema.models[forClass].localization.desc ?? undefined
            : undefined
        }
      >
        {typeof forClass === 'string' ? (
          <>
            <TableIcon label={false} name={forClass} />
            {schema.models[forClass].label}
          </>
        ) : (
          <>
            {typeof icon === 'string' && (
              <TableIcon label={false} name={icon} />
            )}
            {label}
          </>
        )}
      </DataEntry.SubFormTitle>
    ) : (
      <hr className="w-full border-b border-gray-500" />
    );
  },
  SubView({
    resource: rawResource,
    mode: rawMode,
    formType: parentFormType,
    cellData: { fieldNames, formType, isButton, icon, viewName, sortField },
  }) {
    const fields = React.useMemo(
      () =>
        rawResource.specifyModel.getFields(
          fieldNames?.join(backboneFieldSeparator) ?? ''
        ),
      [rawResource, fieldNames]
    );
    const data = useDistantRelated(rawResource, fields);

    const relationship =
      data?.field?.isRelationship === true ? data.field : undefined;

    /*
     * SubView is turned into formTable if formTable is the default FormType for
     * the related table
     */
    const [actualFormType] = useAsyncState<FormType>(
      React.useCallback(
        async () =>
          typeof relationship === 'object'
            ? fetchView(viewName ?? relationship.relatedModel.view)
                .then((viewDefinition) =>
                  typeof viewDefinition === 'object'
                    ? resolveViewDefinition(viewDefinition, formType, rawMode)
                    : undefined
                )
                .then((definition) => definition?.formType ?? 'form')
            : undefined,
        [viewName, formType, rawMode, relationship]
      ),
      false
    );

    const [interactionCollection] = useAsyncState<
      Collection<AnySchema> | false
    >(
      React.useCallback(
        async () =>
          typeof relationship === 'object' &&
          relationshipIsToMany(relationship) &&
          typeof data?.resource === 'object' &&
          [
            'LoanPreparation',
            'GiftPreparation',
            'DisposalPreparation',
          ].includes(relationship.relatedModel.name)
            ? data?.resource.rgetCollection(relationship.name)
            : false,
        [relationship, data?.resource]
      ),
      false
    );
    const currentResource = data?.resource;

    const [showPickListForm, setShowPickListForm] =
      React.useState<boolean>(false);
    React.useEffect(
      () =>
        currentResource === undefined
          ? undefined
          : resourceOn(
              currentResource,
              'change:type',
              () =>
                setShowPickListForm(
                  currentResource.get('type') !== PickListTypes.ITEMS
                ),
              true
            ),
      [currentResource]
    );

    const mode = rawResource === data?.resource ? rawMode : 'view';
    if (
      relationship === undefined ||
      currentResource === undefined ||
      interactionCollection === undefined ||
      actualFormType === undefined
    )
      return null;
    const pickList = toTable(currentResource, 'PickList');

    if (typeof pickList === 'object' && showPickListForm)
      return <PickListEditor relationship={relationship} resource={pickList} />;
    else if (interactionCollection === false || actualFormType === 'form')
      return (
        <SubView
          formType={actualFormType}
          icon={icon}
          isButton={isButton}
          mode={mode}
          parentFormType={parentFormType}
          parentResource={currentResource}
          relationship={relationship}
          sortField={sortField}
          viewName={viewName}
        />
      );
    else
      return (
        <FormTableInteraction
          collection={interactionCollection}
          dialog={false}
          mode={mode}
          sortField={sortField}
          onClose={f.never}
          onDelete={undefined}
        />
      );
  },
  Panel({ mode, formType, resource, cellData: { display, ...cellData } }) {
    const viewDefinition = React.useMemo(
      () => ({
        ...cellData,
        mode,
        name: 'panel',
        formType,
        model: resource.specifyModel,
      }),
      [cellData, mode, formType, resource.specifyModel]
    );
    const form = (
      <SpecifyForm
        display={display}
        resource={resource}
        viewDefinition={viewDefinition}
      />
    );
    return display === 'inline' ? <div className="mx-auto">{form}</div> : form;
  },
  Command({
    cellData: {
      commandDefinition: { label, commandDefinition },
    },
    id,
    resource,
  }) {
    return (
      <UiCommand
        commandDefinition={commandDefinition}
        id={id}
        label={label}
        resource={resource}
      />
    );
  },
  Blank() {
    return null;
  },
  Unsupported({ cellData: { cellType = commonText.nullInline() } }) {
    return (
      <>
        {commonText.colonLine({
          label: formsText.unsupportedCellType(),
          value: cellType,
        })}
      </>
    );
  },
};

export function FormCell({
  resource,
  mode,
  cellData,
  id,
  formatId,
  formType,
  align,
  verticalAlign,
}: {
  readonly resource: SpecifyResource<AnySchema>;
  readonly mode: FormMode;
  readonly cellData: ValueOf<CellTypes>;
  readonly id: string | undefined;
  readonly formatId: (id: string) => string;
  readonly formType: FormType;
  readonly align: typeof cellAlign[number];
  readonly verticalAlign: typeof cellVerticalAlign[number];
}): JSX.Element {
  const Render = cellRenderers[cellData.type] as typeof cellRenderers['Field'];
  return (
    <Render
      align={align}
      cellData={cellData as CellTypes['Field']}
      formatId={formatId}
      formType={formType}
      id={id}
      mode={mode}
      resource={resource}
      verticalAlign={verticalAlign}
    />
  );
}
