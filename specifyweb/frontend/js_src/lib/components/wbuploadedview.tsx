/**
 * Workbench Upload results side bar with table counts
 *
 * @module
 */

import React from 'react';

import type { Tables } from '../datamodel';
import { sortFunction } from '../helpers';
import { commonText } from '../localization/common';
import { wbText } from '../localization/workbench';
import { getModel } from '../schema';
import type { RR } from '../types';
import { defined } from '../types';
import { Button, H2, Ul } from './basic';
import { TableIcon } from './common';

function TableResults({
  tableName,
  recordCount,
}: {
  readonly tableName: keyof Tables;
  readonly recordCount: number;
}): JSX.Element {
  return (
    <li className="flex items-center gap-1">
      <TableIcon label={false} name={tableName} />
      <span>{`${defined(getModel(tableName)).label}: ${recordCount}`}</span>
    </li>
  );
}

export function WbUploaded({
  recordCounts,
  onClose: handleClose,
  isUploaded,
}: {
  readonly recordCounts: RR<keyof Tables, number>;
  readonly onClose: () => void;
  readonly isUploaded: boolean;
}): JSX.Element {
  return (
    <div className="flex h-full w-60 flex-col gap-4">
      <div>
        <H2>
          {isUploaded
            ? wbText('uploadResults')
            : wbText('potentialUploadResults')}
        </H2>
        <p>
          {isUploaded
            ? wbText('wbUploadedDescription')
            : wbText('wbUploadedPotentialDescription')}
        </p>
      </div>
      <Ul className="flex flex-1 flex-col gap-2">
        {Object.entries(recordCounts)
          .sort(sortFunction(([_tableName, recordCount]) => recordCount, false))
          .map(([tableName, recordCount], index) => (
            <TableResults
              key={index}
              recordCount={recordCount}
              tableName={tableName}
            />
          ))}
      </Ul>
      <Button.Small onClick={handleClose}>{commonText('close')}</Button.Small>
    </div>
  );
}
