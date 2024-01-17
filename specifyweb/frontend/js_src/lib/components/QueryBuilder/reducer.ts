/**
 * Actions reducer for the Query Builder
 */

import type { Action, State } from 'typesafe-reducer';
import { generateReducer } from 'typesafe-reducer';

import type { RA } from '../../utils/types';
import { moveItem, replaceItem } from '../../utils/utils';
import type { SerializedResource } from '../DataModel/helperTypes';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { SpecifyModel } from '../DataModel/specifyModel';
import type { SpQuery, Tables } from '../DataModel/types';
import {
  mappingPathIsComplete,
  mutateMappingPath,
} from '../WbPlanView/helpers';
import type { MappingPath } from '../WbPlanView/Mapper';
import type { QueryField } from './helpers';
import { parseQueryFields } from './helpers';

export type MainState = State<
  'MainState',
  {
    readonly fields: RA<QueryField>;
    readonly mappingView: MappingPath;
    readonly openedElement: {
      readonly line: number;
      readonly index: number | undefined;
    };
    /*
     * This is incremented each time the query is run
     * It is used to trigger React.useEffect and React.useCallback hooks
     */
    readonly queryRunCount: number;
    readonly baseTableName: keyof Tables;
  }
>;

export const getInitialState = ({
  query,
  model,
  autoRun,
}: {
  readonly query: SerializedResource<SpQuery>;
  readonly queryResource: SpecifyResource<SpQuery>;
  readonly model: SpecifyModel;
  readonly autoRun: boolean;
}): MainState => ({
  type: 'MainState',
  fields: parseQueryFields(query.fields ?? []),
  mappingView: ['0'],
  queryRunCount: autoRun ? 1 : 0,
  openedElement: { line: 1, index: undefined },
  /*
   * This value never changes. It is part of the state to be accessible by
   * the reducer
   */
  baseTableName: model.name,
});

type Actions =
  | Action<
      'ChangeFieldAction',
      { readonly line: number; readonly field: QueryField }
    >
  | Action<
      'ChangeOpenedElementAction',
      { readonly line: number; readonly index: number | undefined }
    >
  | Action<
      'ChangeSelectElementValueAction',
      {
        readonly line: number | 'mappingView';
        readonly index: number;
        readonly close: boolean;
        readonly newValue: string;
        readonly isRelationship: boolean;
        readonly parentTableName: keyof Tables | undefined;
        readonly newTableName: keyof Tables | undefined;
        readonly currentTableName: keyof Tables | undefined;
      }
    >
  | Action<
      'LineMoveAction',
      { readonly line: number; readonly direction: 'down' | 'up' }
    >
  | Action<'ChangeFieldsAction', { readonly fields: RA<QueryField> }>
  | Action<'FocusLineAction', { readonly line: number }>
  | Action<'ResetStateAction', { readonly state: MainState }>
  | Action<'RunQueryAction'>
  | Action<'SavedQueryAction'>;

export const reducer = generateReducer<MainState, Actions>({
  ResetStateAction: ({ action: { state } }) => state,
  RunQueryAction: ({ state }) => ({
    ...state,
    queryRunCount: state.queryRunCount + 1,
  }),
  ChangeOpenedElementAction: ({ action, state }) => ({
    ...state,
    openedElement: {
      line: action.line,
      index: action.index,
    },
  }),
  FocusLineAction: ({ action, state }) =>
    state.openedElement.line === action.line
      ? state
      : {
          ...state,
          mappingView: mappingPathIsComplete(
            state.fields[action.line].mappingPath
          )
            ? state.fields[action.line].mappingPath
            : state.mappingView,
          openedElement: {
            line: action.line,
            index: undefined,
          },
        },
  LineMoveAction: ({ state, action }) => ({
    ...state,
    openedElement: {
      line: action.direction === 'up' ? action.line - 1 : action.line + 1,
      index: undefined,
    },
    fields: moveItem(state.fields, action.line, action.direction),
  }),
  ChangeFieldsAction: ({ action, state }) => ({
    ...state,
    fields: action.fields,
  }),
  ChangeFieldAction: ({ action, state }) => ({
    ...state,
    fields: replaceItem(state.fields, action.line, action.field),
  }),
  ChangeSelectElementValueAction: ({ state, action }) => {
    const newMappingPath = mutateMappingPath({
      lines: [],
      mappingView:
        action.line === 'mappingView'
          ? state.mappingView
          : state.fields[action.line].mappingPath,
      line: 'mappingView',
      index: action.index,
      newValue: action.newValue,
      isRelationship: action.isRelationship,
      parentTableName: action.parentTableName,
      currentTableName: action.currentTableName,
      newTableName: action.newTableName,
      ignoreToMany: true,
    });

    if (action.line === 'mappingView')
      return {
        ...state,
        mappingView: newMappingPath,
      };

    return {
      ...state,
      fields: replaceItem(state.fields, action.line, {
        ...state.fields[action.line],
        mappingPath: newMappingPath,
      }),
      openedElement: {
        line: state.openedElement.line,
        index: action.close ? undefined : state.openedElement.index,
      },
      autoMapperSuggestions: undefined,
    };
  },
  SavedQueryAction: ({ state }) => ({ ...state }),
});
