import { f } from '../../utils/functools';
import type { RA, ValueOf } from '../../utils/types';
import { defined } from '../../utils/types';
import { removeKey } from '../../utils/utils';
import { isTreeResource } from '../InitialContext/treeRanks';
import { relationshipIsToMany } from '../WbPlanView/mappingHelpers';
import { addMissingFields } from './addMissingFields';
import type {
  AnySchema,
  AnyTree,
  SerializedModel,
  SerializedResource,
  TableFields,
} from './helperTypes';
import type { SpecifyResource } from './legacyTypes';
import { parseResourceUrl, resourceToJson } from './resource';
import { schema, strictGetModel } from './schema';
import type { LiteralField, Relationship } from './specifyField';
import type { SpecifyModel } from './specifyModel';
import type { Tables } from './types';

/** Like resource.toJSON(), but keys are converted to camel case */
export const serializeResource = <SCHEMA extends AnySchema>(
  resource: SerializedModel<SCHEMA> | SpecifyResource<SCHEMA>
): SerializedResource<SCHEMA> =>
  serializeModel<SCHEMA>(
    'toJSON' in resource ? resourceToJson(resource) : resource,
    (resource as SpecifyResource<SCHEMA>)?.specifyModel?.name
  );

export const specialFields = new Set([
  'id',
  'resource_uri',
  'recordset_info',
  '_tableName',
]);

// REFACTOR: get rid of the need for this
export function resourceToModel<SCHEMA extends AnySchema = AnySchema>(
  resource: SerializedModel<SCHEMA> | SerializedResource<SCHEMA>,
  tableName?: keyof Tables
) {
  return strictGetModel(
    defined(
      tableName ??
        (resource as SerializedResource<SCHEMA>)._tableName ??
        parseResourceUrl(
          'resource_uri' in resource ? (resource.resource_uri as string) : ''
        )?.[0],
      `Unable to serialize resource because table name is unknown.${
        process.env.NODE_ENV === 'test'
          ? `\nMake sure your test file calls requireContext();`
          : ''
      }`
    )
  );
}

/** Recursive helper for serializeResource */
function serializeModel<SCHEMA extends AnySchema>(
  resource: SerializedModel<SCHEMA>,
  tableName?: keyof Tables
): SerializedResource<SCHEMA> {
  const model = resourceToModel(resource, tableName);
  const fields = [...model.fields.map(({ name }) => name), model.idField.name];

  return addMissingFields(
    model.name,
    Object.fromEntries(
      Object.entries(resource).map(([lowercaseFieldName, value]) => {
        let camelFieldName = fields.find(
          (fieldName) => fieldName.toLowerCase() === lowercaseFieldName
        );
        if (camelFieldName === undefined) {
          camelFieldName = lowercaseFieldName;
          if (!specialFields.has(lowercaseFieldName))
            console.warn(
              `Trying to serialize unknown field ${lowercaseFieldName} for table ${model.name}`,
              resource
            );
        }
        if (
          typeof value === 'object' &&
          value !== null &&
          !specialFields.has(camelFieldName)
        ) {
          const field = model.getField(lowercaseFieldName);
          const tableName =
            field === undefined || !field.isRelationship
              ? undefined
              : field.relatedModel.name;
          return [
            camelFieldName,
            Array.isArray(value)
              ? value.map((value) =>
                  serializeModel(
                    value as unknown as SerializedModel<SCHEMA>,
                    tableName
                  )
                )
              : serializeModel(
                  value as unknown as SerializedModel<AnySchema>,
                  tableName
                ),
          ];
        } else return [camelFieldName, value];
      })
    )
  ) as SerializedResource<SCHEMA>;
}

export const isResourceOfType = <TABLE_NAME extends keyof Tables>(
  resource: SpecifyResource<AnySchema>,
  tableName: TABLE_NAME
  // @ts-expect-error
): resource is SpecifyResource<Tables[TABLE_NAME]> =>
  resource.specifyModel.name === tableName;

export const toTable = <TABLE_NAME extends keyof Tables>(
  resource: SpecifyResource<AnySchema>,
  tableName: TABLE_NAME
): SpecifyResource<Tables[TABLE_NAME]> | undefined =>
  resource.specifyModel.name === tableName
    ? (resource as SpecifyResource<Tables[TABLE_NAME]>)
    : undefined;

export const toResource = <TABLE_NAME extends keyof Tables>(
  resource: SerializedResource<AnySchema>,
  tableName: TABLE_NAME
): SerializedResource<Tables[TABLE_NAME]> | undefined =>
  resource._tableName === tableName
    ? (resource as SerializedResource<Tables[TABLE_NAME]>)
    : undefined;

/**
 * The model.field has a very broad type to reduce type conflicts in components
 * that deal with generic schemas (accept AnySchema or a SCHEMA extends AnySchema)
 */
export const getField = <
  SCHEMA extends ValueOf<Tables>,
  FIELD extends TableFields<SCHEMA>
>(
  model: SpecifyModel<SCHEMA>,
  name: FIELD
): FIELD extends keyof SCHEMA['fields'] ? LiteralField : Relationship =>
  model.field[name] as FIELD extends keyof SCHEMA['fields']
    ? LiteralField
    : Relationship;

export const toTreeTable = (
  resource: SpecifyResource<AnySchema>
): SpecifyResource<AnyTree> | undefined =>
  isTreeResource(resource) ? resource : undefined;

export const toTables = <TABLE_NAME extends keyof Tables>(
  resource: SpecifyResource<AnySchema>,
  tableNames: RA<TABLE_NAME>
): SpecifyResource<Tables[TABLE_NAME]> | undefined =>
  f.includes(tableNames, resource.specifyModel.name)
    ? (resource as SpecifyResource<Tables[TABLE_NAME]>)
    : undefined;

export const deserializeResource = <SCHEMA extends AnySchema>(
  serializedResource: SerializedModel<SCHEMA> | SerializedResource<SCHEMA>
): SpecifyResource<SCHEMA> =>
  new schema.models[
    /**
     * This assertion, while not required by TypeScript, is needed to fix
     * a typechecking performance issue (it was taking 5s to typecheck this
     * line according to TypeScript trace analyzer)
     */
    (serializedResource as SerializedResource<SCHEMA>)._tableName
  ].Resource(removeKey(serializedResource, '_tableName' as 'id'));

/**
 * Example usage:
 * resource: Collector
 * fields: agent -> lastName
 * Would return [agent, lastName] if agent exists
 *
 */
export async function fetchDistantRelated(
  resource: SpecifyResource<AnySchema>,
  fields: RA<LiteralField | Relationship> | undefined
): Promise<
  | {
      readonly resource: SpecifyResource<AnySchema> | undefined;
      readonly field: LiteralField | Relationship | undefined;
    }
  | undefined
> {
  if (
    Array.isArray(fields) &&
    fields.some(
      (field) =>
        field.isRelationship &&
        relationshipIsToMany(field) &&
        field !== fields.at(-1)
    )
  ) {
    console.error(
      'Can not index inside of a -to-many relationship. Use an aggregator instead'
    );
    return undefined;
  }

  const related =
    fields === undefined || fields.length === 0
      ? resource
      : fields.length === 1
      ? await resource.fetch()
      : await resource.rgetPromise(
          fields
            .slice(0, -1)
            .map(({ name }) => name)
            .join('.')
        );

  const field = fields?.at(-1);
  const relatedResource = related ?? undefined;
  return relatedResource === undefined && field === undefined
    ? undefined
    : {
        resource: relatedResource,
        field,
      };
}
