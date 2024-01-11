import React from 'react';

import { commonText } from '../../localization/common';
import { resourcesText } from '../../localization/resources';
import { schemaText } from '../../localization/schema';
import type { GetSet } from '../../utils/types';
import { localized } from '../../utils/types';
import { removeItem, replaceItem } from '../../utils/utils';
import { Button } from '../Atoms/Button';
import { className } from '../Atoms/className';
import { Input, Label } from '../Atoms/Form';
import { icons } from '../Atoms/Icons';
import { ReadOnlyContext } from '../Core/Contexts';
import type { SpecifyTable } from '../DataModel/specifyTable';
import { fetchContext as fetchFieldFormatters } from '../FieldFormatters';
import { relationshipIsToMany } from '../WbPlanView/mappingHelpers';
import {
  FormattersPickList,
  GenericFormatterPickList,
  ResourceMapping,
} from './Components';
import type { Formatter } from './spec';

export function Fields({
  table,
  fields: [fields, setFields],
}: {
  readonly table: SpecifyTable;
  readonly fields: GetSet<Formatter['definition']['fields'][number]['fields']>;
}): JSX.Element {
  const [displayFormatter, setDisplayFormatter] = React.useState(false);
  return (
    <>
      {fields.length === 0 ? null : (
        <table
          /*
           * REFACTOR: replace min-w-[35rem] with a container query that replaces
           *   table layout with list layout
           */
          className={`
            grid-table min-w-[35rem]
            gap-y-4 gap-x-4
            ${
              displayFormatter
                ? 'grid-cols-[min-content_max-content_auto_min-content]'
                : 'grid-cols-[min-content_1fr_min-content]'
            }
          `}
        >
          <thead>
            <tr>
              <th>{resourcesText.separator()}</th>
              <th>{schemaText.field()}</th>
              {displayFormatter && <th>{schemaText.customFieldFormat()}</th>}
              <th />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <Field
                displayFormatter={displayFormatter}
                field={[
                  field,
                  (field): void => setFields(replaceItem(fields, index, field)),
                ]}
                key={index}
                table={table}
                onRemove={(): void => setFields(removeItem(fields, index))}
              />
            ))}
          </tbody>
        </table>
      )}
      <div className="flex gap-2">
        <Button.Success
          onClick={(): void =>
            setFields([
              ...fields,
              {
                separator: localized(' '),
                aggregator: undefined,
                formatter: undefined,
                fieldFormatter: undefined,
                field: undefined,
              },
            ])
          }
        >
          {resourcesText.addField()}
        </Button.Success>
        <span className="-ml-2 flex-1" />
        {fields.length > 0 && (
          <Label.Inline>
            <Input.Checkbox
              checked={displayFormatter}
              onClick={(): void => setDisplayFormatter(!displayFormatter)}
            />
            {resourcesText.customizeFieldFormatters()}
          </Label.Inline>
        )}
      </div>
    </>
  );
}

function Field({
  table,
  field: [field, handleChange],
  onRemove: handleRemove,
  displayFormatter,
}: {
  readonly table: SpecifyTable;
  readonly field: GetSet<
    Formatter['definition']['fields'][number]['fields'][number]
  >;
  readonly onRemove: () => void;
  readonly displayFormatter: boolean;
}): JSX.Element {
  const isReadOnly = React.useContext(ReadOnlyContext);
  const [openIndex, setOpenIndex] = React.useState<number | undefined>(
    undefined
  );
  return (
    <tr>
      <td>
        <Input.Text
          aria-label={resourcesText.separator()}
          isReadOnly={isReadOnly}
          value={field.separator}
          onValueChange={(separator): void =>
            handleChange({
              ...field,
              separator,
            })
          }
        />
      </td>
      <td>
        <ResourceMapping
          mapping={[
            field.field,
            (fieldMapping): void =>
              handleChange({
                ...field,
                field: fieldMapping,
              }),
          ]}
          openIndex={[openIndex, setOpenIndex]}
          table={table}
        />
      </td>
      {displayFormatter && (
        <td>
          <FieldFormatter field={[field, handleChange]} />
        </td>
      )}
      <td>
        <Button.Small
          aria-label={commonText.remove()}
          title={commonText.remove()}
          variant={className.dangerButton}
          onClick={handleRemove}
        >
          {icons.trash}
        </Button.Small>
      </td>
    </tr>
  );
}

function FieldFormatter({
  field: [field, handleChange],
}: {
  readonly field: GetSet<
    Formatter['definition']['fields'][number]['fields'][number]
  >;
}): JSX.Element | null {
  const lastField = field.field?.at(-1);
  if (lastField === undefined) return null;
  else if (!lastField.isRelationship)
    return (
      <Label.Inline className="w-full">
        <GenericFormatterPickList
          itemsPromise={fetchFieldFormatters}
          table={lastField.table}
          value={field.fieldFormatter}
          onChange={(fieldFormatter): void =>
            handleChange({
              ...field,
              fieldFormatter,
            })
          }
        />
      </Label.Inline>
    );
  else if (relationshipIsToMany(lastField))
    return (
      <Label.Inline className="w-full">
        <FormattersPickList
          table={lastField.relatedTable}
          type="aggregators"
          value={field.aggregator}
          onChange={(aggregator): void =>
            handleChange({
              ...field,
              aggregator,
            })
          }
        />
      </Label.Inline>
    );
  else
    return (
      <Label.Inline className="w-full">
        {resourcesText.formatter()}
        <FormattersPickList
          table={lastField.relatedTable}
          type="formatters"
          value={field.formatter}
          onChange={(formatter): void =>
            handleChange({
              ...field,
              formatter,
            })
          }
        />
      </Label.Inline>
    );
}
