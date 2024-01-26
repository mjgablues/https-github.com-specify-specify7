import type { ResolvablePromise } from '../../utils/promise';
import { flippedPromise } from '../../utils/promise';
import type { IR, RA } from '../../utils/types';
import { filterArray, overwriteReadOnly } from '../../utils/types';
import { removeKey } from '../../utils/utils';
import { formatConjunction } from '../Atoms/Internationalization';
import { isTreeResource } from '../InitialContext/treeRanks';
import type { BusinessRuleDefs } from './businessRuleDefs';
import { businessRuleDefs } from './businessRuleDefs';
import { backboneFieldSeparator, djangoLookupSeparator } from './helpers';
import type { AnySchema, AnyTree, CommonFields } from './helperTypes';
import type { SpecifyResource } from './legacyTypes';
import { SaveBlockers } from './saveBlockers';
import type { LiteralField, Relationship } from './specifyField';
import type { Collection, SpecifyModel } from './specifyModel';
import { initializeTreeRecord, treeBusinessRules } from './treeBusinessRules';
import type { CollectionObjectAttachment } from './types';
import type { UniquenessRule } from './uniquenessRules';
import { getUniqueInvalidReason, getUniquenessRules } from './uniquenessRules';

/* eslint-disable functional/no-this-expression */
// eslint-disable-next-line functional/no-class
export class BusinessRuleManager<SCHEMA extends AnySchema> {
  // eslint-disable-next-line functional/prefer-readonly-type
  public pendingPromise: Promise<BusinessRuleResult | undefined> =
    Promise.resolve(undefined);

  private readonly resource: SpecifyResource<SCHEMA>;

  private readonly rules: BusinessRuleDefs<AnySchema | SCHEMA> | undefined;

  // eslint-disable-next-line functional/prefer-readonly-type
  private fieldChangePromises: Record<string, ResolvablePromise<string>> = {};

  // eslint-disable-next-line functional/prefer-readonly-type
  private watchers: Record<string, () => void> = {};

  public constructor(resource: SpecifyResource<SCHEMA>) {
    this.resource = resource;
    this.rules = businessRuleDefs[this.resource.specifyModel.name];
  }

  public setUpManager(): void {
    this.addPromise(this.invokeRule('customInit', undefined, [this.resource]));
    if (isTreeResource(this.resource as SpecifyResource<AnySchema>))
      initializeTreeRecord(this.resource as SpecifyResource<AnyTree>);

    this.resource.on('change', this.changed, this);
    this.resource.on('add', this.added, this);
    this.resource.on('remove', this.removed, this);
  }

  public async checkField(
    fieldName: keyof SCHEMA['fields'] | keyof SCHEMA['toOneIndependent']
  ): Promise<RA<BusinessRuleResult<SCHEMA>>> {
    const processedFieldName = fieldName.toString().toLowerCase();
    const thisCheck: ResolvablePromise<string> = flippedPromise();
    this.addPromise(thisCheck);

    if (this.fieldChangePromises[processedFieldName] !== undefined)
      this.fieldChangePromises[processedFieldName].resolve('superseded');
    this.fieldChangePromises[processedFieldName] = thisCheck;

    const checks: RA<Promise<BusinessRuleResult<SCHEMA> | undefined>> = [
      this.invokeRule('fieldChecks', processedFieldName, [this.resource]),
      this.checkUnique(processedFieldName),
      isTreeResource(this.resource as SpecifyResource<AnySchema>)
        ? treeBusinessRules(
            this.resource as SpecifyResource<AnyTree>,
            processedFieldName
          )
        : Promise.resolve({ valid: true }),
    ];

    return Promise.all(checks).then((results) => {
      /*
       * TEST: Check if the variable is necessary. The legacy js code called processCheckFieldResults first before resolving.
       *       Using the variable to maintain same functionality, as processCheckFieldResults might have side-effects,
       *       especially since pendingPromise is public. Assuming that legacy code had no related bugs to this.
       */
      const resolvedResult: RA<BusinessRuleResult<SCHEMA>> =
        thisCheck === this.fieldChangePromises[processedFieldName]
          ? this.processCheckFieldResults(processedFieldName, results)
          : [{ valid: true }];
      thisCheck.resolve('finished');
      return resolvedResult;
    });
  }

  private addPromise(
    promise: Promise<BusinessRuleResult | string | undefined>
  ): void {
    this.pendingPromise = Promise.allSettled([
      this.pendingPromise,
      promise,
    ]).then(() => undefined);
  }

  private changed(resource: SpecifyResource<SCHEMA>): void {
    if (
      !resource.isBeingInitialized() &&
      typeof resource.changed === 'object'
    ) {
      this.addPromise(
        Promise.all(
          Object.keys(resource.changed).map(async (field) =>
            this.checkField(field)
          )
        ).then(() => undefined)
      );
    }
  }

  private added(
    resource: SpecifyResource<SCHEMA>,
    collection: Collection<SCHEMA>
  ): void {
    /**
     * REFACTOR: remove the need for this and the orderNumber check by
     * implementing a general solution on the backend
     */
    if (resource.specifyModel.getField('ordinal') !== undefined)
      (resource as SpecifyResource<CollectionObjectAttachment>).set(
        'ordinal',
        collection.indexOf(resource),
        { silent: true }
      );
    this.addPromise(
      this.invokeRule('onAdded', undefined, [resource, collection])
    );
  }

  private removed(
    resource: SpecifyResource<SCHEMA>,
    collection: Collection<SCHEMA>
  ): void {
    this.addPromise(
      this.invokeRule('onRemoved', undefined, [resource, collection])
    );
  }

  private processCheckFieldResults(
    fieldName: keyof SCHEMA['fields'],
    results: RA<BusinessRuleResult<SCHEMA> | undefined>
  ): RA<BusinessRuleResult<SCHEMA>> {
    return filterArray(
      results.map((result) => {
        if (result === undefined) return undefined;

        if (result.valid && typeof result.action === 'function')
          result.action();

        if (typeof result.key === 'string' && !result.valid) {
          this.resource.saveBlockers!.add(
            result.key,
            fieldName as string,
            result.reason
          );
        }

        if (typeof result.key === 'string' && result.valid) {
          this.resource.saveBlockers!.remove(result.key);
        }

        return result;
      })
    );
  }

  private async checkUnique(
    fieldName: keyof SCHEMA['fields']
  ): Promise<BusinessRuleResult<SCHEMA>> {
    const rules = getUniquenessRules(this.resource.specifyModel.name) ?? [];
    const rulesToCheck = rules.filter(({ rule }) =>
      rule.fields.some(
        (ruleFieldName) =>
          ruleFieldName.toLowerCase() === (fieldName as string).toLowerCase()
      )
    );

    const results = rulesToCheck.map(async ({ rule }) => this.uniqueIn(rule));
    void Promise.all(results).then((results) =>
      results
        .flatMap((result: BusinessRuleResult<SCHEMA>) => result.localDuplicates)
        .filter((result) => result !== undefined)
        .forEach((duplicate: SpecifyResource<SCHEMA> | undefined) => {
          if (duplicate === undefined) return;
          const event = `${duplicate.cid}:${fieldName as string}`;
          if (this.watchers[event] === undefined) {
            this.watchers[event] = (): void =>
              duplicate.on(
                `change:${fieldName as string}`,
                () => void this.checkField(fieldName)
              );
            duplicate.once('remove', () => {
              this.watchers = removeKey(this.watchers, event);
            });
          }
        })
    );
    return Promise.all(results).then((results) => {
      const invalids = results.filter((result) => !result.valid);
      return invalids.length === 0
        ? { key: `br-uniqueness-${fieldName as string}`, valid: true }
        : {
            key: `br-uniqueness-${fieldName as string}`,
            valid: false,
            reason: formatConjunction(
              invalids.map(
                (invalid) =>
                  invalid['reason' as keyof BusinessRuleResult] as string
              )
            ),
          };
    });
  }

  private async uniqueIn(
    rule: UniquenessRule
  ): Promise<BusinessRuleResult<SCHEMA>> {
    const invalidResponse: BusinessRuleResult<SCHEMA> = {
      valid: false,
      reason: getUniqueInvalidReason(
        rule.scopes.map(
          (scope) =>
            getFieldsFromPath(this.resource.specifyModel, scope).at(
              -1
            ) as Relationship
        ),
        rule.fields.map((field) =>
          this.resource.specifyModel.strictGetField(field)
        )
      ),
    };

    const getFieldValue = async (
      resource: SpecifyResource<AnySchema>,
      fieldName: string
    ): Promise<{
      readonly id: number | undefined;
      readonly cid: string | undefined;
      readonly value: number | string | null | undefined;
    }> => {
      const localCollection = resource.collection ?? {
        models: [],
        field: undefined,
      };

      const collectionField = localCollection.field;
      if (
        localCollection.related !== undefined &&
        collectionField?.name.toLowerCase() ===
          fieldName.split(djangoLookupSeparator)[0].toLowerCase()
      ) {
        const related = localCollection.related;
        const splitName = fieldName.split(djangoLookupSeparator);
        return splitName.length === 1
          ? ({ id: related.id, cid: related.cid, value: related.id } as const)
          : getFieldValue(
              related,
              fieldName
                .split(djangoLookupSeparator)
                .slice(1)
                .join(djangoLookupSeparator)
            );
      }

      const related: SpecifyResource<AnySchema> | number | string | null =
        await resource.getRelated(
          fieldName.replaceAll(djangoLookupSeparator, backboneFieldSeparator)
        );
      return {
        id: related?.id,
        cid: related?.cid,
        value:
          related?.cid === undefined
            ? (related as unknown as number | string | null)
            : related.id,
      } as const;
    };

    const generateFilters = async (
      resource: SpecifyResource<AnySchema>,
      fieldNames: RA<string>
    ): Promise<
      IR<{
        readonly id: number | undefined;
        readonly cid: string | undefined;
        readonly value: number | string | null | undefined;
      }>
    > =>
      Object.fromEntries(
        await Promise.all(
          fieldNames.map(async (fieldName) => [
            fieldName,
            await getFieldValue(resource, fieldName),
          ])
        )
      );

    const hasSameValues = async (
      other: SpecifyResource<SCHEMA>,
      fieldValues: IR<{
        readonly id: number | undefined;
        readonly cid: string | undefined;
        readonly value: number | string | null | undefined;
      }>
    ): Promise<boolean> => {
      if (other.id != null && other.id === this.resource.id) return false;
      if (other.cid === this.resource.cid) return false;

      const otherFilters = await generateFilters(
        other,
        Object.keys(fieldValues)
      );

      return Object.entries(otherFilters).every(
        ([fieldName, otherFieldValues]) => {
          const {
            id: otherId,
            cid: otherCid,
            value: otherValue,
          } = otherFieldValues;
          const { id, cid, value } = fieldValues[fieldName];
          if (otherCid !== undefined && cid !== undefined && otherCid === cid)
            return true;
          if (otherId !== undefined && id !== undefined && otherId === id)
            return true;
          return (
            otherId === undefined &&
            otherCid === undefined &&
            otherValue === value
          );
        }
      );
    };

    const localCollection = this.resource.collection ?? {
      models: [],
      field: undefined,
    };

    const filters = await generateFilters(this.resource, [
      ...rule.fields,
      ...rule.scopes,
    ]);

    const duplicates = filterArray(
      await Promise.all(
        localCollection.models.map(async (other) => {
          const isDuplicate = await hasSameValues(other, filters);
          return isDuplicate ? other : undefined;
        })
      )
    );
    if (duplicates.length > 0) {
      overwriteReadOnly(invalidResponse, 'localDuplicates', duplicates);
      return invalidResponse;
    }

    const partialFilters = Object.fromEntries(
      Object.entries(filters).map(([fieldName, { value }]) => [
        fieldName,
        value,
      ])
    );

    if (Object.values(partialFilters).includes(undefined) || partialFilters[rule.scopes[0]] === null)
      return { valid: true };

    return new this.resource.specifyModel.LazyCollection({
      filters: partialFilters as Partial<
        CommonFields &
          Readonly<Record<string, boolean | number | string | null>> &
          SCHEMA['fields'] & { readonly orderby: string }
      >,
    })
      .fetch()
      .then(async (fetchedCollection) =>
        Promise.all(
          fetchedCollection.models.map(async (others) =>
            hasSameValues(others, filters)
          )
        )
      )
      .then((foundDuplicates) =>
        foundDuplicates.includes(true) ? invalidResponse : { valid: true }
      );
  }

  private async invokeRule(
    ruleName: keyof BusinessRuleDefs<SCHEMA>,
    fieldName: keyof SCHEMA['fields'] | undefined,
    args: RA<unknown>
  ): Promise<BusinessRuleResult | undefined> {
    if (this.rules === undefined) {
      return undefined;
    }
    let rule = this.rules[ruleName];

    if (
      rule !== undefined &&
      ruleName === 'fieldChecks' &&
      fieldName !== undefined
    )
      rule =
        rule[
          this.resource.specifyModel.getField(fieldName as string)
            ?.name as keyof typeof rule
        ];

    if (rule === undefined) return undefined;

    /*
     * For some reason, Typescript still thinks that this.rules["fieldChecks"] is a valid rule
     * thus rule.apply() would be invalid
     *  However, rule will never be this.rules["fieldChecks"]
     */
    // @ts-expect-error
    return rule(...args);
  }
}
/* eslint-enable functional/no-this-expression */

export function getFieldsFromPath(
  model: SpecifyModel,
  fieldPath: string
): RA<LiteralField | Relationship> {
  const fields = fieldPath.split(djangoLookupSeparator);

  let currentModel = model;
  return fields.map((fieldName) => {
    const field = currentModel.strictGetField(fieldName);
    if (field.isRelationship) {
      currentModel = field.relatedModel;
    }
    return field;
  });
}

export function attachBusinessRules(
  resource: SpecifyResource<AnySchema>
): void {
  const businessRuleManager = new BusinessRuleManager(resource);
  overwriteReadOnly(resource, 'saveBlockers', new SaveBlockers(resource));
  overwriteReadOnly(resource, 'businessRuleManager', businessRuleManager);
  businessRuleManager.setUpManager();
}

export type BusinessRuleResult<SCHEMA extends AnySchema = AnySchema> = {
  readonly key?: string;
  readonly localDuplicates?: RA<SpecifyResource<SCHEMA>>;
} & (
  | {
      readonly valid: true;
      readonly action?: () => void;
    }
  | { readonly valid: false; readonly reason: string }
);
