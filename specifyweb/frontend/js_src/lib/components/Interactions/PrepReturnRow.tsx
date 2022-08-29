import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import { useBooleanState } from '../../hooks/useBooleanState';
import { commonText } from '../../localization/common';
import { formsText } from '../../localization/forms';
import { defined } from '../../utils/types';
import { Button } from '../Atoms/Button';
import { Input } from '../Atoms/Form';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import { schema } from '../DataModel/schema';
import type { LoanPreparation } from '../DataModel/types';
import type { PrepReturnRowState } from './PrepReturnDialog';
import { AutoGrowTextArea } from '../Molecules/AutoGrowTextArea';
import { fieldFormat } from '../../utils/fieldFormat';

export function PrepReturnRow({
  preparation,
  resolve,
  returns,
  unresolved,
  remarks,
  onChange: handleChange,
}: PrepReturnRowState & {
  readonly preparation: SpecifyResource<LoanPreparation>;
  readonly onChange: (newState: PrepReturnRowState) => void;
}): JSX.Element {
  const [data] = useAsyncState<{
    readonly catalogNumber: string;
    readonly taxon: string;
    readonly prepType: string;
  }>(
    React.useCallback(
      async () =>
        preparation.rgetPromise('preparation').then(async (loanPreparation) =>
          loanPreparation === null
            ? {
                catalogNumber: '',
                taxon:
                  preparation.get('descriptionOfMaterial')?.slice(0, 50) ??
                  formsText('unCataloged'),
                prepType: '',
              }
            : {
                ...(await loanPreparation.rgetPromise('collectionObject').then<{
                  readonly catalogNumber: string;
                  readonly taxon: string;
                }>(async (collectionObject) => ({
                  catalogNumber: await fieldFormat(
                    defined(
                      schema.models.CollectionObject.getLiteralField(
                        'catalogNumber'
                      )
                    ),
                    undefined,
                    collectionObject.get('catalogNumber')
                  ),
                  taxon: await collectionObject
                    .rgetCollection('determinations')
                    .then(({ models }) =>
                      models
                        .find((determination) => determination.get('isCurrent'))
                        ?.rgetPromise('preferredTaxon')
                    )
                    .then((taxon) => taxon?.get('fullName') ?? ''),
                }))),
                prepType: await loanPreparation
                  .rgetPromise('prepType')
                  .then((prepType) => prepType.get('name')),
              }
        ),
      [preparation]
    ),
    false
  );

  const [showRemarks, _, __, handleToggle] = useBooleanState();

  return (
    <>
      <tr>
        <td>
          <Input.Checkbox
            aria-label={formsText('selectAll')}
            checked={resolve > 0}
            title={formsText('selectAll')}
            onValueChange={(checked): void =>
              handleChange({
                resolve: checked ? unresolved : 0,
                returns: checked ? unresolved : 0,
                unresolved,
                remarks,
              })
            }
          />
        </td>
        <td>{data?.catalogNumber ?? commonText('loading')}</td>
        <td>{data?.taxon ?? commonText('loading')}</td>
        <td className="text-center">
          {data?.prepType ?? commonText('loading')}
        </td>
        <td className="text-center">{unresolved}</td>
        <td>
          <Input.Number
            aria-label={formsText('returnedAmount')}
            className="w-12"
            max={unresolved}
            min={0}
            title={formsText('returnedAmount')}
            value={returns}
            onValueChange={(returns): void =>
              handleChange({
                // Make return <= unresolved
                returns: Math.min(returns, unresolved),
                // Make resolved >= returned
                resolve: Math.max(returns, resolve),
                unresolved,
                remarks,
              })
            }
          />
        </td>
        <td>
          <Input.Number
            aria-label={formsText('resolvedAmount')}
            className="w-12"
            max={unresolved}
            min={returns}
            title={formsText('resolvedAmount')}
            value={resolve}
            onValueChange={(resolve): void =>
              handleChange({
                // Make resolve <= unresolved
                resolve: Math.min(resolve, unresolved),
                // Make returned <= resolved
                returns: Math.min(resolve, returns),
                unresolved,
                remarks,
              })
            }
          />
        </td>
        <td>
          {resolve > 0 && (
            <Button.Icon
              aria-pressed={showRemarks}
              className="return-remark w-full"
              icon="annotation"
              title={formsText('remarks')}
              onClick={handleToggle}
            />
          )}
        </td>
      </tr>
      {showRemarks && resolve > 0 ? (
        <tr>
          <td />
          <td className="col-span-7">
            <AutoGrowTextArea
              aria-label={formsText('remarks')}
              containerClassName="w-full"
              forwardRef={(target): void => target?.focus()}
              placeholder={formsText('remarks')}
              title={formsText('remarks')}
              value={remarks}
              // Focus the input when toggled
              onValueChange={(remarks): void =>
                handleChange({
                  resolve,
                  returns,
                  unresolved,
                  remarks,
                })
              }
            />
          </td>
        </tr>
      ) : undefined}
    </>
  );
  // Hide show remarks field here
}
