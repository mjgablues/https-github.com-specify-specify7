import React from 'react';

import { f } from '../functools';
import { sortFunction, toggleItem } from '../helpers';
import { commonText } from '../localization/common';
import { formsText } from '../localization/forms';
import { getUniqueFields } from '../resource';
import type { LiteralField, Relationship } from '../specifyfield';
import type { SpecifyModel } from '../specifymodel';
import type { RA } from '../types';
import { Button, Form, H3, Input, Label, Submit, Ul } from './basic';
import { useBooleanState, useId } from './hooks';
import { Dialog } from './modaldialog';
import { useCachedState } from './statecache';

export function CarryForwardButton({
  model,
}: {
  readonly model: SpecifyModel;
}): JSX.Element {
  const [isOpen, handleOpen, handleClose] = useBooleanState();
  return (
    <>
      <Button.Small
        title={formsText('carryForwardDescription')}
        onClick={handleOpen}
      >
        {formsText('carryForward')}
      </Button.Small>
      {isOpen && <CarryForwardConfig model={model} onClose={handleClose} />}
    </>
  );
}

const normalize = (fields: RA<string>): RA<string> =>
  Array.from(fields).sort(sortFunction(f.id));

function CarryForwardConfig({
  model,
  onClose: handleClose,
}: {
  readonly model: SpecifyModel;
  readonly onClose: () => void;
}): JSX.Element {
  const [showHiddenFields = true, setShowHiddenFields] = useCachedState(
    'forms',
    'carryForwardShowHidden'
  );

  const [globalConfig = {}, setGlobalConfig] = useCachedState(
    'forms',
    'carryForward'
  );

  const uniqueFields = getUniqueFields(model);
  const defaultConfig = model.fields
    .map(({ name }) => name)
    .filter((fieldName) => !uniqueFields.includes(fieldName));
  const isDefaultConfig = (fields: RA<string>): boolean =>
    JSON.stringify(normalize(fields)) ===
    JSON.stringify(normalize(defaultConfig));

  const config =
    (globalConfig[model.name] as RA<string> | undefined)?.filter(
      (fieldName) => !uniqueFields.includes(fieldName)
    ) ?? defaultConfig;
  const handleChange = (fields: RA<string>): void =>
    setGlobalConfig({
      ...globalConfig,
      [model.name]: f.var(normalize(fields), (fields) =>
        isDefaultConfig(fields) ? undefined : fields
      ),
    });

  const literalFields = model.literalFields.filter(
    ({ overrides }) => !overrides.isHidden || showHiddenFields
  );
  const relationships = model.relationships.filter(
    ({ overrides }) => !overrides.isHidden || showHiddenFields
  );

  const id = useId('form-carry-forward');
  return (
    <Dialog
      buttons={
        <>
          <Button.Green
            disabled={isDefaultConfig(config)}
            onClick={(): void => handleChange(defaultConfig)}
          >
            {formsText('selectAll')}
          </Button.Green>
          <Button.Green
            disabled={config.length === 0}
            onClick={(): void => handleChange([])}
          >
            {formsText('deselectAll')}
          </Button.Green>
          <Submit.Blue form={id('form')} onClick={handleClose}>
            {commonText('close')}
          </Submit.Blue>
        </>
      }
      header={formsText('carryForwardDescription')}
      onClose={handleClose}
    >
      <Form id={id('form')} onSubmit={handleClose}>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          <H3>{commonText('fields')}</H3>
          <CarryForwardCategory
            carryForward={config}
            fields={literalFields}
            uniqueFields={uniqueFields}
            onChange={handleChange}
          />
          <h3>{commonText('relationships')}</h3>
          <CarryForwardCategory
            carryForward={config}
            fields={relationships}
            uniqueFields={uniqueFields}
            onChange={handleChange}
          />
        </div>
        <Label.ForCheckbox className="border-t pt-2 dark:border-neutral-700">
          <Input.Checkbox
            checked={showHiddenFields}
            onValueChange={setShowHiddenFields}
          />
          {commonText('revealHiddenFormFields')}
        </Label.ForCheckbox>
      </Form>
    </Dialog>
  );
}

function CarryForwardCategory({
  fields,
  uniqueFields,
  carryForward,
  onChange: handleChange,
}: {
  readonly fields: RA<LiteralField | Relationship>;
  readonly uniqueFields: RA<string>;
  readonly carryForward: RA<string>;
  readonly onChange: (carryForward: RA<string>) => void;
}): JSX.Element {
  return (
    <Ul>
      {fields.map(({ name, label }) => (
        <li key={name}>
          <Label.ForCheckbox
            title={
              uniqueFields.includes(name)
                ? formsText('carryForwardUniqueField')
                : undefined
            }
          >
            <Input.Checkbox
              checked={f.includes(carryForward, name)}
              disabled={uniqueFields.includes(name)}
              onValueChange={(): void =>
                handleChange(toggleItem(carryForward, name))
              }
            />
            {label}
          </Label.ForCheckbox>
        </li>
      ))}
    </Ul>
  );
}
