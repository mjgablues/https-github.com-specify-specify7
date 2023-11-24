import React from 'react';

import { useCachedState } from '../../hooks/useCachedState';
import { formsText } from '../../localization/forms';
import { ajax } from '../../utils/ajax';
import { getCache, setCache } from '../../utils/cache';
import type { GetOrSet, RA, RR } from '../../utils/types';
import { formatConjunction } from '../Atoms/Internationalization';
import { load } from '../InitialContext';
import type { SerializedResource } from './helperTypes';
import type { LiteralField, Relationship } from './specifyField';
import { strictGetTable } from './tables';
import type { SpLocaleContainerItem, Tables } from './types';

export type UniquenessRule = {
  readonly id: number | null;
  readonly fields: RA<SerializedResource<SpLocaleContainerItem>>;
  readonly scope: SerializedResource<SpLocaleContainerItem> | null;
  readonly isDatabaseConstraint: boolean;

  // This property is assigned on the frontend and is not saved to the backend
  readonly uniqueId?: number;
};

export type UniquenessRules = RR<keyof Tables, RA<UniquenessRule> | undefined>;

export const fetchContext = import('./schema')
  .then(async ({ fetchContext }) => fetchContext)
  .then(async (schema) =>
    load<UniquenessRules>(
      `/businessrules/uniqueness_rules/${schema.domainLevelIds.discipline}/`,
      'application/json'
    )
  )
  .then((data) =>
    // Convert all lowercase table names from backend to PascalCase
    Object.fromEntries(
      Object.entries(data).map(([lowercaseTableName, rules]) => [
        strictGetTable(lowercaseTableName).name,
        rules,
      ])
    )
  )
  .then((data) => {
    setCache('businessRules', 'uniqueRules', data);
    return data;
  });

export function getUniquenessRules(): UniquenessRules | undefined;
export function getUniquenessRules<TABLE_NAME extends keyof Tables>(
  table: TABLE_NAME
): UniquenessRules[TABLE_NAME] | undefined;
export function getUniquenessRules<TABLE_NAME extends keyof Tables>(
  table?: TABLE_NAME
): UniquenessRules | UniquenessRules[TABLE_NAME] {
  const uniquenessRules = getCache('businessRules', 'uniqueRules');
  return uniquenessRules === undefined
    ? undefined
    : table === undefined
    ? uniquenessRules
    : uniquenessRules[table];
}

export function useTableUniquenessRules(
  tableName: keyof Tables
): readonly [
  ...tableRules: GetOrSet<UniquenessRules[keyof Tables]>,
  setCachedTableRules: (value: UniquenessRules[keyof Tables]) => void,
  uniqueIdRef: React.MutableRefObject<number>
] {
  const [uniquenessRules = {}, setUniquenessRules] = useCachedState(
    'businessRules',
    'uniqueRules'
  );

  const currentUniqueId = React.useRef(0);

  const assignUniqueIds = React.useCallback(
    (rules: UniquenessRules[keyof Tables]): UniquenessRules[keyof Tables] =>
      (rules ?? []).map((rule) => {
        if (rule.uniqueId === undefined) {
          const adjustedRule = {
            ...rule,
            uniqueId: currentUniqueId.current,
          };
          currentUniqueId.current += 1;
          return adjustedRule;
        }
        return rule;
      }),
    []
  );

  const [rawModelRules = [], setTableUniquenessRules] = React.useState(
    assignUniqueIds(uniquenessRules[tableName])
  );

  const setCachedTableRules = (value: UniquenessRules[keyof Tables]): void => {
    setUniquenessRules(
      Object.fromEntries(
        Object.entries(uniquenessRules).map(([table, rules]) => [
          table,
          table === tableName ? value : rules,
        ])
      )
    );
  };

  const modelRules = React.useMemo(
    () => assignUniqueIds(rawModelRules),
    [assignUniqueIds, rawModelRules]
  );

  return [
    modelRules,
    setTableUniquenessRules,
    setCachedTableRules,
    currentUniqueId,
  ];
}

export function getUniqueInvalidReason(
  scopeField: LiteralField | Relationship | undefined,
  fields: RA<LiteralField | Relationship>
): string {
  if (fields.length > 1)
    return scopeField
      ? formsText.valuesOfMustBeUniqueToField({
          values: formatConjunction(fields.map(({ label }) => label)),
          fieldName: scopeField.label,
        })
      : formsText.valuesOfMustBeUniqueToDatabase({
          values: formatConjunction(fields.map(({ label }) => label)),
        });
  else
    return scopeField
      ? formsText.valueMustBeUniqueToField({
          fieldName: scopeField.label,
        })
      : formsText.valueMustBeUniqueToDatabase();
}

export type UniquenessRuleValidation = {
  readonly totalDuplicates: number;
  readonly fields: RA<{
    readonly [field: string]: number | string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly _duplicates: number;
  }>;
};

export async function validateUniqueness<
  TABLE_NAME extends keyof Tables,
  SCHEMA extends Tables[TABLE_NAME]
>(
  table: TABLE_NAME,
  fields: RA<string & keyof SCHEMA['fields']>,
  scope: keyof SCHEMA['toOneIndependent'] | undefined,
  strictSearch: boolean = false
): Promise<UniquenessRuleValidation> {
  return ajax<UniquenessRuleValidation>(
    '/businessrules/uniqueness_rules/validate/',
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Accept: 'application/json' },
      method: 'POST',
      body: {
        table,
        rule: {
          fields: fields.map((field) => ({
            name: field,
          })),
          scope: scope === undefined ? null : scope,
          strict: strictSearch,
        },
      },
    }
  ).then(({ data }) => data);
}
