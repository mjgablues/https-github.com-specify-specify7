import React from 'react';

import { commonText } from '../../localization/common';
import { schemaText } from '../../localization/schema';
import { Input, Label } from '../Atoms/Form';
import { Link } from '../Atoms/Link';
import { getField } from '../DataModel/helpers';
import type { SerializedResource } from '../DataModel/helperTypes';
import { schema } from '../DataModel/schema';
import type { SpLocaleContainer, Tables } from '../DataModel/types';
import { AutoGrowTextArea } from '../Molecules/AutoGrowTextArea';
import { PickList } from './Components';
import { SchemaConfigColumn } from './Fields';
import { filterFormatters } from './helpers';
import type { NewSpLocaleItemString, SpLocaleItemString } from './index';
import type { SchemaData } from './SetupHooks';

export const maxSchemaValueLength = getField(
  schema.models.SpLocaleItemStr,
  'text'
).length;

export function SchemaConfigTable({
  schemaData,
  isReadOnly,
  container,
  name,
  desc,
  onChange: handleChange,
  onChangeName: handleChangeName,
  onChangeDesc: handleChangeDesc,
}: {
  readonly schemaData: SchemaData;
  readonly isReadOnly: boolean;
  readonly container: SerializedResource<SpLocaleContainer>;
  readonly onChange: (container: SerializedResource<SpLocaleContainer>) => void;
  readonly name: NewSpLocaleItemString | SpLocaleItemString | undefined;
  readonly onChangeName: (
    containerName: NewSpLocaleItemString | SpLocaleItemString
  ) => void;
  readonly desc: NewSpLocaleItemString | SpLocaleItemString | undefined;
  readonly onChangeDesc: (
    containerName: NewSpLocaleItemString | SpLocaleItemString
  ) => void;
}): JSX.Element {
  return (
    <SchemaConfigColumn
      header={commonText.colonLine({
        label: schemaText.table(),
        value: container.name,
      })}
    >
      <Label.Block>
        {schemaText.caption()}
        <Input.Text
          isReadOnly={isReadOnly || name === undefined}
          maxLength={maxSchemaValueLength}
          required
          value={name?.text ?? ''}
          onValueChange={(text): void => handleChangeName({ ...name!, text })}
        />
      </Label.Block>
      <Label.Block>
        {schemaText.description()}
        <AutoGrowTextArea
          className="resize-y"
          isReadOnly={isReadOnly || desc === undefined}
          maxLength={maxSchemaValueLength}
          value={desc?.text ?? ''}
          onValueChange={(text): void => handleChangeDesc({ ...desc!, text })}
        />
      </Label.Block>
      <Label.Block>
        {schemaText.tableFormat()}
        <PickList
          disabled={isReadOnly}
          groups={{
            '': filterFormatters(
              schemaData.formatters,
              container.name as keyof Tables
            ),
          }}
          value={container.format}
          onChange={(format): void => handleChange({ ...container, format })}
        />
      </Label.Block>
      <Label.Block>
        {schemaText.tableAggregation()}
        <PickList
          disabled={isReadOnly}
          groups={{
            '': filterFormatters(
              schemaData.aggregators,
              container.name as keyof Tables
            ),
          }}
          value={container.aggregator}
          onChange={(aggregator): void =>
            handleChange({ ...container, aggregator })
          }
        />
      </Label.Block>
      <Label.Block>
        <Link.Small
          href={`/specify/overlay/configure/uniqueness/${container.name}`}
        >
          {schemaText.uniquenessRules()}
        </Link.Small>
      </Label.Block>
      <Label.Inline>
        <Input.Checkbox
          checked={container.isHidden}
          isReadOnly={isReadOnly}
          onValueChange={(isHidden): void =>
            handleChange({ ...container, isHidden })
          }
        />
        {schemaText.hideTable()}
      </Label.Inline>
    </SchemaConfigColumn>
  );
}
