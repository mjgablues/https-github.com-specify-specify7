import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import type { RA } from '../../utils/types';
import type { BrokerRecord } from './fetchers';
import { fetchName, fetchOccurrence } from './fetchers';

export function useOccurrence(
  guid: string | undefined = ''
): RA<BrokerRecord> | undefined {
  return useAsyncState(
    React.useCallback(
      async () => (guid === '' ? [] : fetchOccurrence(guid)),
      [guid]
    ),
    false
  )[0];
}

export function useSpecies(
  speciesName: string | undefined
): RA<BrokerRecord> | undefined {
  return useAsyncState(
    React.useCallback(
      async () => (speciesName === undefined ? [] : fetchName(speciesName)),
      [speciesName]
    ),
    false
  )[0];
}