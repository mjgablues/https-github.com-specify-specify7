import {ajax} from '../../utils/ajax';
import type {RA} from '../../utils/types';
import {camelToHuman, split} from '../../utils/utils';
import type {Tables} from '../DataModel/types';
import type {ViewDefinition} from '../FormParse';
import {userInformation} from '../InitialContext/userInformation';
import {formatUrl} from '../Router/queryString';

type PresentableViewDefinition = ViewDefinition & {
  readonly category: string;
  readonly editUrl: string | undefined;
};

export type AllTableViews = {
  readonly database: RA<
    PresentableViewDefinition & { readonly collectionId: number }
  >;
  readonly disk: RA<PresentableViewDefinition>;
};

/**
 * Fetch all views for a given table accessible to current user in each collection
 * Note: this may result in duplicates
 */
export const fetchAllViews = async (
  tableName: keyof Tables,
  cache = false
): Promise<AllTableViews> =>
  Promise.all(
    userInformation.availableCollections.map(async ({ id }) =>
      ajax<RA<ViewDefinition>>(
        formatUrl('/context/views.json', {
          table: tableName,
          collectionid: id,
        }),
        {
          headers: {
            Accept: 'application/json',
          },
          cache: cache ? undefined : 'no-cache',
        }
      ).then(({ data }) => data.map((view) => ({ ...view, collectionId: id })))
    )
  ).then((data) => {
    const [disk, database] = split(
      data.flat(),
      (view) => view.viewsetFile === null
    );
    /*
     * Note, several requests may return the same view definition
     */
    return {
      // Deduplicate views from database
      database: Object.values(
        Object.fromEntries(
          database.map((view) => [`${view.viewsetId ?? ''}_${view.name}`, view])
        )
      ).map((view) => augmentDatabaseView(tableName, view)),
      // Deduplicate views from disk
      disk: Object.values(
        Object.fromEntries(
          disk.map((view) => [`${view.viewsetFile ?? ''}_${view.name}`, view])
        )
      ).map(augmentDiskView),
    };
  });

const augmentDatabaseView = (
  tableName: keyof Tables,
  view: ViewDefinition & { readonly collectionId: number }
): PresentableViewDefinition & { readonly collectionId: number } => ({
  ...view,
  category:
    (view.viewsetLevel === 'Collection'
      ? userInformation.availableCollections.find(
          ({ id }) => id === view.collectionId
        )?.collectionName
      : undefined) ?? camelToHuman(view.viewsetLevel),
  editUrl:
    view.viewsetId === null
      ? undefined
      : `/specify/resources/view-set/${view.viewsetId}/${tableName}/${view.name}/`,
});

const augmentDiskView = (view: ViewDefinition): PresentableViewDefinition => ({
  ...view,
  category:
    typeof view.viewsetFile === 'string'
      ? localizePath(view.viewsetFile)
      : camelToHuman(view.viewsetLevel),
  editUrl: undefined,
});

const localizePath = (path: string): string =>
  path.split('/').slice(0, -1).map(camelToHuman).join(' > ');
