import React from 'react';

import { SearchDialogContext } from '../components/Core/Contexts';
import { fetchDistantRelated } from '../components/DataModel/helpers';
import type {
  AnySchema,
  SerializedResource,
} from '../components/DataModel/helperTypes';
import type { SpecifyResource } from '../components/DataModel/legacyTypes';
import { resourceOn } from '../components/DataModel/resource';
import { serializeResource } from '../components/DataModel/serializers';
import type {
  LiteralField,
  Relationship,
} from '../components/DataModel/specifyField';
import { raise } from '../components/Errors/Crash';
import {
  mergeParsers,
  Parser,
  resolveParser,
} from '../utils/parser/definitions';
import type { GetOrSet, RA } from '../utils/types';
import { useLiveState } from './useLiveState';

/**
 * A wrapper for Backbone.Resource that integrates with React.useState for
 * easier state tracking
 *
 * @example Can detect field changes using React hooks:
 *   React.useEffect(()=>{}, [resource]);
 * @example Or only certain fields:
 *   React.useEffect(()=>{}, [resource.name, resource.fullname]);
 */
export function useResource<SCHEMA extends AnySchema>(
  table: SpecifyResource<SCHEMA>
): GetOrSet<SerializedResource<SCHEMA>> {
  const [resource, setResource] = React.useState<SerializedResource<SCHEMA>>(
    () => serializeResource(table)
  );

  const isChanging = React.useRef<boolean>(false);
  React.useEffect(() =>
    resourceOn(
      table,
      'change',
      () => {
        if (isChanging.current) return;
        const newResource = serializeResource(table);
        previousResourceRef.current = newResource;
        setResource(newResource);
      },
      false
    )
  );

  const previousResourceRef =
    React.useRef<SerializedResource<SCHEMA>>(resource);
  const previousTable = React.useRef(table);
  React.useEffect(() => {
    if (previousTable.current !== table) {
      previousTable.current = table;
      const newResource = serializeResource(table);
      previousResourceRef.current = newResource;
      setResource(newResource);
      return;
    }
    const changes = Object.entries(resource).filter(
      ([key, newValue]) =>
        (newValue as unknown) !== previousResourceRef.current[key]
    );
    if (changes.length === 0) return;

    isChanging.current = true;
    changes.forEach(([key, newValue]) =>
      table.set(key as 'resource_uri', newValue as never)
    );
    isChanging.current = false;

    previousResourceRef.current = resource;
  }, [resource, table]);

  return [resource, setResource];
}

/** Hook for getting save blockers for a tables's field */
export function useSaveBlockers({
  resource,
  fieldName,
}: {
  readonly resource: SpecifyResource<AnySchema> | undefined;
  readonly fieldName: string;
}): string {
  const [errors, setErrors] = React.useState<string>(
    () => resource?.saveBlockers?.getFieldErrors(fieldName).join('\n') ?? ''
  );
  React.useEffect(
    () =>
      resource === undefined
        ? undefined
        : resourceOn(
            resource,
            'blockersChanged',
            (): void =>
              setErrors(
                resource.saveBlockers?.getFieldErrors(fieldName).join('\n') ??
                  ''
              ),
            false
          ),
    [resource, fieldName]
  );
  return errors;
}

export function useDistantRelated(
  resource: SpecifyResource<AnySchema>,
  fields: RA<LiteralField | Relationship> | undefined
): Awaited<ReturnType<typeof fetchDistantRelated>> {
  const [data, setData] =
    React.useState<Awaited<ReturnType<typeof fetchDistantRelated>>>(undefined);
  React.useEffect(() => {
    let destructorCalled = false;
    const handleChange = (): void =>
      void fetchDistantRelated(resource, fields)
        .then((data) => (destructorCalled ? undefined : setData(data)))
        .catch(raise);

    if (fields === undefined || fields.length === 0) {
      handleChange();
      return undefined;
    }
    const destructor = resourceOn(
      resource,
      `change:${fields[0].name}`,
      handleChange,
      true
    );
    return (): void => {
      destructor();
      destructorCalled = true;
    };
  }, [resource, fields]);
  return data;
}

export function useParser(
  field: LiteralField | Relationship | undefined,
  defaultParser?: Parser
): Parser {
  const isInSearchDialog = React.useContext(SearchDialogContext);
  return useLiveState<Parser>(
    React.useCallback(() => {
      /*
       * Disable parser when in search dialog as space and quote characters are
       * interpreted differently in them  thus validation for them should be
       * disabled.
       */
      const parser =
        isInSearchDialog || field === undefined
          ? { type: 'text' as const }
          : resolveParser(field);
      return typeof defaultParser === 'object'
        ? mergeParsers(parser, defaultParser)
        : parser;
    }, [field, isInSearchDialog, defaultParser])
  )[0];
}
