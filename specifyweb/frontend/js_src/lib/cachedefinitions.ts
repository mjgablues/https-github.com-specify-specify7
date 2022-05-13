/**
 * Typings for the cache buckets
 *
 * @module
 */

import type hot from 'handsontable';
import type { State } from 'typesafe-reducer';

import type { SortConfig } from './components/common';
import type { SearchPreferences } from './components/wbadvancedsearch';
import type { Attachment, SpQuery, Tables } from './datamodel';
import type { AnyTree } from './datamodelutils';
import type { LeafletCacheSalt, MarkerLayerName } from './leaflet';
import type { UserPreferences } from './preferencesutils';
import type { RA } from './types';

/** The types of cached values are defined here */
export type CacheDefinitions = {
  readonly forms: {
    // Print label on form save
    readonly printOnSave: boolean;
  };
  readonly wbPlanViewUi: {
    // Whether to show less commonly used tables when selected base table
    readonly showHiddenTables: boolean;
    // Whether to show fields hidden in schema in the mapper
    readonly showHiddenFields: boolean;
    // Whether to show Mapping Editor in the mapper
    readonly showMappingView: boolean;
    readonly mappingViewHeight: number;
  };
  readonly queryBuilder: {
    // Whether to show fields hidden in schema in the query builder
    readonly showHiddenFields: boolean;
    readonly mappingViewHeight: number;
  };
  readonly schemaConfig: {
    readonly showHiddenTables: boolean;
  };
  readonly leaflet: {
    // eslint-disable-next-line multiline-comment-style, capitalized-comments
    // prettier-ignore
    // Remembers the selected base layer
    readonly [Property in `currentLayer${LeafletCacheSalt}`]: string;
  } & {
    // eslint-disable-next-line multiline-comment-style, capitalized-comments
    // prettier-ignore
    // Remembers the chosen overlays (markers/polygons/boundaries/...)
    readonly [Property in `show${Capitalize<MarkerLayerName>}`]: boolean;
  };
  readonly workbench: {
    readonly searchProperties: SearchPreferences;
  };
  readonly tree: {
    readonly // Collapsed ranks in a given tree
    [key in `collapsedRanks${AnyTree['tableName']}`]: RA<number>;
  } & {
    readonly // Open nodes in a given tree
    [key in `conformation${AnyTree['tableName']}`]: string;
  };
  readonly workBenchSortConfig: {
    readonly /*
     * WorkBench column sort setting in a given dataset
     * {Collection ID}_{Dataset ID}
     */
    [key in `${number}_${number}`]: RA<hot.columnSorting.Config>;
  };
  readonly sortConfig: {
    readonly listOfQueries: SortConfig<
      keyof SpQuery['fields'] &
        ('name' | 'timestampCreated' | 'timestampModified')
    >;
    readonly listOfDataSets: SortConfig<
      'name' | 'dateCreated' | 'dateUploaded'
    >;
  };
  readonly attachments: {
    readonly sortOrder:
      | (string & keyof Attachment['fields'])
      | `-${string & keyof Attachment['fields']}`;
    readonly filter:
      | State<'all'>
      | State<'unused'>
      | State<'byTable', { readonly tableName: keyof Tables }>;
    // Attachments grid scale
    readonly scale: number;
  };
  readonly geoLocate: {
    readonly width: number;
    readonly height: number;
  };
  readonly userPreferences: {
    /**
     * User preferences are cached here, because, unlike most other initial
     * context resources, preferences are not cached by the browser, since they
     * are fetched using the standard resource API.
     * Additionally, since preferences contain the schema language to load,
     * schema can not be fetched until preferences are fetched.
     * Finally, a splash screen may be rendered before preferences are fetched,
     * causing Specify to flash user its white mode, or font size to change
     * on the fly.
     */
    readonly cached: UserPreferences;
  };
  readonly securityTool: {
    readonly policiesLayout: 'vertical' | 'horizontal';
    readonly previewCollapsed: boolean;
    readonly institutionPoliciesExpanded: boolean;
  };
};
