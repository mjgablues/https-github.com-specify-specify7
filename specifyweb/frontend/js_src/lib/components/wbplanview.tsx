/*
*
* Workbench plan mapper
*
* */

'use strict';

import React                     from 'react';
import '../../css/wbplanview.css';
import navigation                from '../navigation';
import * as cache                from '../wbplanviewcache';
import schema                    from '../schema';
import fetch_data_model          from '../wbplanviewmodelfetcher';
import WBPlanViewMapper, {
  AutomapperSuggestion,
  deduplicate_mappings,
  defaultLineOptions,
  defaultMappingViewHeight,
  get_automapper_suggestions,
  get_lines_from_headers,
  get_lines_from_upload_plan,
  go_back,
  mapping_path_is_complete,
  MappingLine,
  MappingPath,
  minMappingViewHeight,
  mutate_mapping_path,
  save_plan,
  SelectElementPosition,
  validate,
  WBPlanViewMapperBaseProps,
}                                from './wbplanviewmapper';
import {
  LoadingScreen,
  ModalDialog,
}                                from './modaldialog';
import data_model_storage        from '../wbplanviewmodel';
import { ListOfBaseTables }      from './wbplanviewcomponents';
import {
  Action,
  generate_dispatch,
  generate_reducer,
  State,
}                                from '../statemanagement';
import { Icon }                  from './customselectelement';
import createBackboneView        from './reactbackboneextend';
import { JqueryPromise }         from '../legacy_types';
import {
  FalsyUploadPlan, MatchBehaviors,
  upload_plan_string_to_object,
  UploadPlan,
} from '../wbplanviewconverter';
import { get_mapping_line_data } from '../wbplanviewnavigator';


// general definitions
export type Dataset = {
  id: number,
  name: string,
  columns: string[],
  rows: string[][],
  uploadplan: UploadPlan | null,
  uploaderstatus: Record<string, unknown> | null,
  uploadresult: Record<string, unknown> | null,
}

export interface SpecifyResource {
  readonly id: number;
  readonly get: (query: string) => SpecifyResource | any,
  readonly rget: (query: string) =>
    JqueryPromise<SpecifyResource | any>,
  readonly set: (query: string, value: any) => void,
  readonly save: () => void,
}

interface UploadPlanTemplate {
  dataset_name: string,
  upload_plan: UploadPlan
}


//states

interface LoadingStateBase<T extends string> extends State<T> {
  dispatch_action?: (action: WBPlanViewActions) => void,
}

type LoadTemplateSelectionState =
  LoadingStateBase<'LoadTemplateSelectionState'>

interface NavigateBackState extends State<'NavigateBackState'> {
  readonly wb: SpecifyResource,
}

type LoadingStates =
  LoadTemplateSelectionState
  | NavigateBackState;

export interface LoadingState extends State<'LoadingState'> {
  readonly loading_state?: LoadingStates,
  readonly dispatch_action?: WBPlanViewActions,
}

interface BaseTableSelectionState extends State<'BaseTableSelectionState'> {
  readonly show_hidden_tables: boolean,
}

interface TemplateSelectionState extends State<'TemplateSelectionState'> {
  readonly templates: UploadPlanTemplate[],
}

export interface MappingState extends State<'MappingState'>,
  WBPlanViewMapperBaseProps {
  readonly automapper_suggestions_promise?:
    Promise<AutomapperSuggestion[]>,
  readonly changes_made: boolean,
  readonly mappings_are_validated: boolean,
  readonly display_matching_options_dialog: boolean,
  readonly must_match_preferences: Record<string, boolean>,
}

type WBPlanViewStates =
  BaseTableSelectionState
  | LoadingState
  | TemplateSelectionState
  | MappingState;

type WBPlanViewStatesWithParams = WBPlanViewStates & {
  readonly dispatch: (action: WBPlanViewActions) => void,
  readonly props: WBPlanViewProps,
  readonly refObject: React.MutableRefObject<RefStates>,
  readonly refObjectDispatch: (action: RefActions) => void
}


//actions
interface OpenBaseTableSelectionAction
  extends Action<'OpenBaseTableSelectionAction'> {
  referrer?: WBPlanViewStates['type'],
}

interface SelectTableAction extends Action<'SelectTableAction'> {
  readonly table_name: string,
  readonly mapping_is_templated: boolean,
  readonly headers: string[]
}

type ToggleHiddenTablesAction = Action<'ToggleHiddenTablesAction'>

interface UseTemplateAction extends Action<'UseTemplateAction'> {
  readonly dispatch: (action: WBPlanViewActions) => void,
}

type BaseTableSelectionActions =
  OpenBaseTableSelectionAction
  | SelectTableAction
  | ToggleHiddenTablesAction
  | UseTemplateAction;

type CancelTemplateSelectionAction =
  Action<'CancelTemplateSelectionAction'>

interface TemplatesLoadedAction extends Action<'TemplatesLoadedAction'> {
  readonly templates: UploadPlanTemplate[],
}

type TemplateSelectionActions =
  TemplatesLoadedAction
  | CancelTemplateSelectionAction;

type CancelMappingAction =
  Action<'CancelMappingAction'>
  & PublicWBPlanViewProps
  & PartialWBPlanViewProps;

type CommonActions = CancelMappingAction;

interface OpenMappingScreenAction
  extends Action<'OpenMappingScreenAction'> {
  readonly mapping_is_templated: boolean,
  readonly headers: string[],
  readonly upload_plan: FalsyUploadPlan,
}

interface SavePlanAction extends Action<'SavePlanAction'>,
  WBPlanViewWrapperProps,
  PublicWBPlanViewProps {
  readonly ignore_validation?: boolean
}

type ToggleMappingViewAction = Action<'ToggleMappingViewAction'>

type ToggleMappingIsTemplatedAction =
  Action<'ToggleMappingIsTemplatedAction'>

type ToggleHiddenFieldsAction = Action<'ToggleHiddenFieldsAction'>

type ResetMappingsAction = Action<'ResetMappingsAction'>

type ValidationAction = Action<'ValidationAction'>

interface ClearMappingLineAction
  extends Action<'ClearMappingLineAction'> {
  readonly line: number,
}

interface FocusLineAction extends Action<'FocusLineAction'> {
  readonly line: number,
}

type MappingViewMapAction = Action<'MappingViewMapAction'>

type AddNewHeaderAction = Action<'AddNewHeaderAction'>

type AddNewStaticHeaderAction = Action<'AddNewStaticHeaderAction'>

type OpenSelectElementAction =
  Action<'OpenSelectElementAction'>
  & SelectElementPosition

type CloseSelectElementAction = Action<'CloseSelectElementAction'>

export interface ChangeSelectElementValueAction
  extends Action<'ChangeSelectElementValueAction'> {
  readonly value: string,
  readonly is_relationship: boolean,
  readonly line: number | 'mapping_view',
  readonly index: number,
}

interface AutomapperSuggestionsLoadedAction
  extends Action<'AutomapperSuggestionsLoadedAction'> {
  readonly automapper_suggestions: AutomapperSuggestion[],
}

interface AutomapperSuggestionSelectedAction
  extends Action<'AutomapperSuggestionSelectedAction'> {
  readonly suggestion: string,
}

interface StaticHeaderChangeAction
  extends Action<'StaticHeaderChangeAction'> {
  readonly line: number,
  readonly event: React.ChangeEvent<HTMLTextAreaElement>,
}

interface ValidationResultClickAction
  extends Action<'ValidationResultClickAction'> {
  readonly mapping_path: MappingPath,
}

type OpenMatchingLogicDialogAction =
  Action<'OpenMatchingLogicDialogAction'>;

type CloseMatchingLogicDialogAction =
  Action<'CloseMatchingLogicDialogAction'>;

interface MustMatchPrefChangeAction
  extends Action<'MustMatchPrefChangeAction'> {
  readonly table_name: string,
  readonly must_match: boolean,
}

interface ChangeMatchBehaviorAction
  extends Action<'ChangeMatchBehaviorAction'> {
  readonly line: number,
  readonly match_behavior: MatchBehaviors,
}

interface ToggleAllowNullsAction
  extends Action<'ToggleAllowNullsAction'>{
  readonly line: number,
  readonly allow_null: boolean,
}

interface ChangeDefaultValue
  extends Action<'ChangeDefaultValue'> {
  readonly line: number,
  readonly default_value: string|null,
}

export type MappingActions =
  OpenMappingScreenAction
  | SavePlanAction
  | ToggleMappingViewAction
  | ToggleMappingIsTemplatedAction
  | ToggleHiddenFieldsAction
  | ResetMappingsAction
  | ValidationAction
  | ClearMappingLineAction
  | FocusLineAction
  | MappingViewMapAction
  | AddNewHeaderAction
  | AddNewStaticHeaderAction
  | OpenSelectElementAction
  | CloseSelectElementAction
  | ChangeSelectElementValueAction
  | AutomapperSuggestionsLoadedAction
  | AutomapperSuggestionSelectedAction
  | StaticHeaderChangeAction
  | ValidationResultClickAction
  | OpenMatchingLogicDialogAction
  | MustMatchPrefChangeAction
  | CloseMatchingLogicDialogAction
  | ChangeMatchBehaviorAction
  | ToggleAllowNullsAction
  | ChangeDefaultValue;

type WBPlanViewActions =
  BaseTableSelectionActions
  | TemplateSelectionActions
  | CommonActions
  | MappingActions;


interface WBPlanViewProps extends WBPlanViewWrapperProps,
  PublicWBPlanViewProps {
  readonly upload_plan: FalsyUploadPlan,
  readonly headers: string[],
  readonly set_unload_protect: () => void,
}

interface PartialWBPlanViewProps {
  readonly remove_unload_protect: () => void,
}

export interface WBPlanViewWrapperProps extends PartialWBPlanViewProps,
  PublicWBPlanViewProps {
  mapping_is_templated: boolean,
  readonly set_unload_protect: () => void,
}

export interface PublicWBPlanViewProps {
  dataset: Dataset,
}

interface WBPlanViewBackboneProps extends WBPlanViewWrapperProps,
  PublicWBPlanViewProps {
  header: HTMLElement,
  handle_resize: () => void,
}


const schema_fetched_promise = fetch_data_model();


function WBPlanViewHeader({
  stateType,
  title,
  buttonsLeft,
  buttonsRight,
}: {
  stateType: WBPlanViewStates['type'],
  title: string,
  buttonsLeft: JSX.Element,
  buttonsRight: JSX.Element
}): JSX.Element {
  return <div className={
    `wbplanview_header wbplanview_header_${stateType}`
  }>
    <div>
      <span>{title}</span>
      {buttonsLeft}
    </div>
    <div>{buttonsRight}</div>
  </div>;
}

function HeaderWrapper(props: {
  readonly children: React.ReactNode,
  readonly header: JSX.Element,
  readonly state_name: WBPlanViewStates['type'],
  readonly handleClick?: () => void,
  readonly extraContainerProps?: Record<string, unknown>
}): JSX.Element {
  return <div className="wbplanview_event_listener" onClick={(event) =>
    (
      (event.target as HTMLElement).closest(
        '.custom_select_closed_list'
      ) === null &&
      (event.target as HTMLElement).closest(
        '.custom_select_mapping_options_list'
      ) === null
      && props.handleClick
    ) ?
      props.handleClick() :
      undefined
  }>
    {props.header}
    <div
      className={
        `wbplanview_container wbplanview_container_${props.state_name}`
      }
      {...props.extraContainerProps}
    >
      {props.children}
    </div>
  </div>;
}

const getInitialWBPlanViewState = (
  props: OpenMappingScreenAction,
): WBPlanViewStates => (
  {
    type: 'LoadingState',
    dispatch_action: props.upload_plan ?
      {
        ...props,
        type: 'OpenMappingScreenAction',
      } :
      {
        type: 'OpenBaseTableSelectionAction',
      },
  }
);


function mapping_state(
  state: WBPlanViewStates,
): MappingState {
  if (state.type === 'MappingState')
    return state;
  else
    throw new Error('Dispatching this action requires the state ' +
      'to be of type `MappingState`');
}


const modify_line = (
  state: MappingState,
  line: number,
  mapping_line: Partial<MappingLine>,
): MappingLine[] => [
  ...state.lines.slice(0, line),
  {
    ...state.lines[line],
    ...mapping_line,
  },
  ...state.lines.slice(line + 1),
];

const getDefaultMappingState = (): MappingState => (
  {
    type: 'MappingState',
    mapping_is_templated: false,
    show_hidden_fields:
      cache.get<boolean>(
        'ui',
        'show_hidden_fields',
      ),
    show_mapping_view:
      cache.get<boolean>(
        'ui',
        'show_mapping_view',
        {
          default_value: true,
        },
      ),
    base_table_name: '',
    new_header_id: 1,
    mapping_view: ['0'],
    mappings_are_validated: false,
    validation_results: [],
    lines: [],
    changes_made: false,
    display_matching_options_dialog: false,
    must_match_preferences: {},
  }
);

const reducer = generate_reducer<WBPlanViewStates, WBPlanViewActions>({

  //BaseTableSelectionState
  'OpenBaseTableSelectionAction': ({
    state,
    action,
  }) =>
    (
      !action.referrer || action.referrer === state.type
    ) ?
      (
        {
          type: 'BaseTableSelectionState',
          show_hidden_tables:
            cache.get<boolean>(
              'ui',
              'show_hidden_tables',
            ),
        }
      ) :
      state,
  'SelectTableAction': ({action}) => (
    {
      ...getDefaultMappingState(),
      mapping_is_templated: action.mapping_is_templated,
      base_table_name: action.table_name,
      lines: get_lines_from_headers({
        headers: action.headers,
        run_automapper: true,
        base_table_name: action.table_name,
      }),
    }
  ),
  'ToggleHiddenTablesAction': ({state}) => (
    {
      ...state,
      show_hidden_tables: cache.set(
        'ui',
        'show_hidden_tables',
        'show_hidden_tables' in state ?
          !state.show_hidden_tables :
          false,
        {
          overwrite: true,
        },
      ),
    }
  ),
  'UseTemplateAction': ({action}) => (
    {
      type: 'LoadingState',
      loading_state: {
        type: 'LoadTemplateSelectionState',
        dispatch_action: action.dispatch,
      },
    }
  ),

  //TemplateSelectionState
  'TemplatesLoadedAction': ({action}) => (
    {
      type: 'TemplateSelectionState',
      templates: action.templates,
    }
  ),
  'CancelTemplateSelectionAction': () => (
    {
      type: 'BaseTableSelectionState',
      show_hidden_tables: cache.get<boolean>(
        'ui',
        'show_hidden_tables',
      ),
    }
  ),

  //common
  'CancelMappingAction': ({
    state,
    action,
  }) =>
    void (
      go_back(action)
    ) || state,

  //MappingState
  'OpenMappingScreenAction': ({
    action,
  }) => {
    if (action.upload_plan === false)
      throw new Error('Upload plan is not defined');

    const {
      base_table_name,
      lines,
      must_match_preferences,
    } = get_lines_from_upload_plan(
      action.headers,
      action.upload_plan,
    );
    const new_state: MappingState = {
      ...getDefaultMappingState(),
      mapping_is_templated: action.mapping_is_templated,
      must_match_preferences,
      base_table_name,
      lines,
    };

    if (
      new_state.lines.some(({mapping_path}) =>
        mapping_path.length === 0,
      )
    )
      throw new Error('Mapping Path is invalid');

    return new_state;
  },
  'SavePlanAction': ({
    state,
    action,
  }) =>
    save_plan(
      action,
      mapping_state(state),
      action.ignore_validation,
    ),
  'ToggleMappingViewAction': ({state}) => (
    {
      ...mapping_state(state),
      show_mapping_view: cache.set(
        'ui',
        'show_mapping_view',
        !mapping_state(state).show_mapping_view,
        {
          overwrite: true,
        }),
    }
  ),
  'ToggleMappingIsTemplatedAction': ({state}) => (
    {
      ...mapping_state(state),
      mapping_is_templated:
        !mapping_state(state).mapping_is_templated,
    }
  ),
  'ValidationAction': ({state}) =>
    validate(mapping_state(state)),
  'ResetMappingsAction': ({state}) => (
    {
      ...mapping_state(state),
      lines: mapping_state(state).lines.map(line => (
        {
          ...line,
          mapping_path: ['0'],
        }
      )),
      changes_made: true,
      mappings_are_validated: false,
      validation_results: [],
    }
  ),
  'ClearMappingLineAction': ({
    state,
    action,
  }) => (
    {
      ...mapping_state(state),
      lines: modify_line(
        mapping_state(state),
        action.line,
        {
          mapping_path: ['0'],
        },
      ),
      changes_made: true,
      mappings_are_validated: false,
    }
  ),
  'FocusLineAction': ({
    state,
    action,
  }) => {
    if (action.line >= mapping_state(state).lines.length)
      throw new Error(`Tried to focus a line that doesn't exist`);

    const focused_line_mapping_path =
      mapping_state(state).lines[action.line].mapping_path;
    return {
      ...mapping_state(state),
      focused_line: action.line,
      mapping_view:
        mapping_path_is_complete(focused_line_mapping_path) ?
          focused_line_mapping_path :
          mapping_state(state).mapping_view,
    };
  },
  'MappingViewMapAction': ({state}) => {
    const mapping_view_mapping_path =
      mapping_state(state).mapping_view;
    const focused_line = mapping_state(state).focused_line;
    if (
      !mapping_path_is_complete(mapping_view_mapping_path) ||
      typeof focused_line === 'undefined' ||
      focused_line >= mapping_state(state).lines.length
    )
      return state;

    return {
      ...mapping_state(state),
      lines: [
        ...mapping_state(state).lines.slice(0, focused_line),
        {
          ...mapping_state(state).lines[focused_line],
          mapping_path: mapping_view_mapping_path,
        },
        ...mapping_state(state).lines.slice(focused_line + 1),
      ],
      changes_made: true,
      mappings_are_validated: false,
    };
  },
  'AddNewHeaderAction': ({state}) => (
    {
      ...mapping_state(state),
      new_header_id: mapping_state(state).new_header_id + 1,
      lines: [
        ...mapping_state(state).lines,
        {
          name: `New Header ${
            mapping_state(state).new_header_id
          }`,
          type: 'new_column',
          mapping_path: ['0'],
          options: defaultLineOptions,
        },
      ],
      changes_made: true,
      mappings_are_validated: false,
    }
  ),
  'AddNewStaticHeaderAction': ({state}) => (
    {
      ...mapping_state(state),
      lines: [
        ...mapping_state(state).lines,
        {
          name: '',
          type: 'new_static_column',
          mapping_path: ['0'],
          options: defaultLineOptions,
        },
      ],
      changes_made: true,
      mappings_are_validated: false,
    }
  ),
  'ToggleHiddenFieldsAction': ({state}) => (
    {
      ...mapping_state(state),
      show_hidden_fields: cache.set(
        'ui',
        'show_hidden_fields',
        !mapping_state(state).show_hidden_fields,
        {
          overwrite: true,
        }),
      reveal_hidden_fields_clicked: true,
    }
  ),
  'OpenSelectElementAction': ({
    state,
    action,
  }) => (
    {
      ...mapping_state(state),
      open_select_element: {
        line: action.line,
        index: action.index,
      },
      automapper_suggestions_promise:
        typeof mapping_state(state).lines[action.line].mapping_path[
          action.index] === 'undefined'?
          undefined:
          get_automapper_suggestions({
              lines: mapping_state(state).lines,
              line: action.line,
              index: action.index,
              base_table_name: mapping_state(state).base_table_name,
            },
          ),
    }
  ),
  'CloseSelectElementAction': ({state}) =>
    state.type === 'MappingState' ?
      (
        {
          ...mapping_state(state),
          open_select_element: undefined,
          automapper_suggestions_promise: undefined,
          automapper_suggestions: undefined,
        }
      ) :
      state,
  'ChangeSelectElementValueAction': ({
    state,
    action,
  }) => {
    const new_mapping_path =
      mutate_mapping_path({
          lines: mapping_state(state).lines,
          mapping_view: mapping_state(state).mapping_view,
          line: action.line,
          index: action.index,
          value: action.value,
          is_relationship: action.is_relationship,
        },
      );

    if (action.line === 'mapping_view')
      return {
        ...mapping_state(state),
        mapping_view: new_mapping_path,
      };

    return {
      ...mapping_state(state),
      lines: deduplicate_mappings(
        modify_line(
          mapping_state(state),
          action.line,
          {
            mapping_path: new_mapping_path,
          },
        ),
        mapping_state(
          state,
        ).open_select_element?.line ?? false,
      ),
      open_select_element: undefined,
      automapper_suggestions_promise: undefined,
      automapper_suggestions: undefined,
      changes_made: true,
      mappings_are_validated: false,
    };
  },
  'AutomapperSuggestionsLoadedAction': ({
    state,
    action,
  }) => (
    {
      ...mapping_state(state),
      automapper_suggestions: action.automapper_suggestions,
      automapper_suggestions_promise: undefined,
    }
  ),
  'AutomapperSuggestionSelectedAction': ({
    state,
    action: {suggestion},
  }) => (
    {
      ...mapping_state(state),
      lines: modify_line(
        mapping_state(state),
        mapping_state(state).open_select_element!.line,
        {
          mapping_path: mapping_state(
            state,
          ).automapper_suggestions![~~suggestion - 1].mapping_path,
        },
      ),
      open_select_element: undefined,
      automapper_suggestions_promise: undefined,
      automapper_suggestions: undefined,
      changes_made: true,
      mappings_are_validated: false,
    }
  ),
  'StaticHeaderChangeAction': ({
    state,
    action,
  }) => (
    {
      ...mapping_state(state),
      lines: modify_line(
        mapping_state(state),
        action.line,
        {
          name: action.event.target.value,
        },
      ),
    }
  ),
  'ValidationResultClickAction': ({
    state,
    action: {mapping_path},
  }) => (
    {
      ...mapping_state(state),
      mapping_view: mapping_path,
    }
  ),
  'OpenMatchingLogicDialogAction': ({
    state: original_state,
  }) => {

    const state = mapping_state(original_state);

    const array_of_mapping_paths = state.lines.map(line =>
      line.mapping_path,
    );
    const array_of_mapping_line_data = array_of_mapping_paths.flatMap(
      mapping_path =>
        get_mapping_line_data({
          mapping_path,
          base_table_name: state.base_table_name,
          custom_select_type: 'opened_list',
        }).filter((mapping_element_data, index, list) =>
          index !== 0 &&  // exclude base table
          // exclude -to-many
          mapping_element_data.custom_select_subtype !== 'to_many' &&
          (  // exclude direct child of -to-many
            typeof list[index - 1] === 'undefined' ||
            list[index - 1].custom_select_subtype !== 'to_many'
          ),
        ),
    );
    const array_of_tables = array_of_mapping_line_data.map(
      mapping_element_data =>
        mapping_element_data.table_name || '',
    ).filter(table_name =>
      table_name,
    );
    const distinct_list_of_tables = [...new Set(array_of_tables)];
    const must_match_preferences = {
      ...Object.fromEntries(
        distinct_list_of_tables.map(table_name =>
          [table_name, false],
        ),
      ),
      ...state.must_match_preferences,
    };

    return {
      ...state,
      display_matching_options_dialog: true,
      must_match_preferences,
    };
  },
  'CloseMatchingLogicDialogAction': ({state}) => (
    {
      ...mapping_state(state),
      display_matching_options_dialog: false,
    }
  ),
  'MustMatchPrefChangeAction': ({
    state,
    action,
  }) => (
    {
      ...mapping_state(state),
      must_match_preferences: {
        ...mapping_state(state).must_match_preferences,
        [action.table_name]: action.must_match,
      },
    }
  ),
  'ChangeMatchBehaviorAction': ({
    state,
    action
  })=>({
    ...mapping_state(state),
    lines: modify_line(
      mapping_state(state),
      action.line,
      {
        ...mapping_state(state).lines[action.line],
        options: {
          ...mapping_state(state).lines[action.line].options,
          matchBehavior: action.match_behavior
        }
      }
    )
  }),
  'ToggleAllowNullsAction': ({
    state,
    action
  })=>({
    ...mapping_state(state),
    lines: modify_line(
      mapping_state(state),
      action.line,
      {
        ...mapping_state(state).lines[action.line],
        options: {
          ...mapping_state(state).lines[action.line].options,
          nullAllowed: action.allow_null
        }
      }
    )
  }),
  'ChangeDefaultValue': ({
    state,
    action
  })=>({
    ...mapping_state(state),
    lines: modify_line(
      mapping_state(state),
      action.line,
      {
        ...mapping_state(state).lines[action.line],
        options: {
          ...mapping_state(state).lines[action.line].options,
          default: action.default_value
        }
      }
    )
  }),
});

const loading_state_dispatch = generate_dispatch<LoadingStates>({
  'LoadTemplateSelectionState': state => {

    if (typeof state.dispatch_action !== 'function')
      throw new Error('Dispatch function was not provided');

    const wbs = new (
      schema as any
    ).models.Workbench.LazyCollection({
      filters: {orderby: 'name', ownerpermissionlevel: 1},
    });
    wbs.fetch({limit: 5000}).done(() =>
      Promise.all(
        wbs.models.map((wb: any) =>
          wb.rget('workbenchtemplate'),
        ),
      ).then((workbench_templates: any) =>
        state.dispatch_action!({
          type: 'TemplatesLoadedAction',
          templates: workbench_templates.map((wbt: any) => [
            upload_plan_string_to_object(
              wbt.get('remarks') as string,
            ),
            wbt.get('name') as string,
          ]).filter(([upload_plan]: [FalsyUploadPlan]) =>
            upload_plan !== false,
          ).map(([
            upload_plan,
            dataset_name,
          ]: [UploadPlan, string]) => (
            {
              dataset_name,
              upload_plan,
            }
          )),
        }),
      ).catch(error => {
        throw error;
      }),
    );
  },
  'NavigateBackState': state =>  // need to make the `Loading`
    // dialog
    // appear before the `Leave Page?` dialog
    setTimeout(() =>
      navigation.go(`/workbench/${state.wb.id}/`), 10,
    ),
});

const state_reducer = generate_reducer<JSX.Element,
  WBPlanViewStatesWithParams>({
  'LoadingState': ({action: state}) => {
    if (typeof state.loading_state !== 'undefined')
      Promise.resolve('').then(() =>
        loading_state_dispatch(state.loading_state!),
      ).catch(error => {
        throw error;
      });
    if (typeof state.dispatch_action !== 'undefined')
      state.dispatch(state.dispatch_action);
    return <LoadingScreen />;
  },
  'BaseTableSelectionState': ({
    action: state,
  }) => <HeaderWrapper
    state_name={state.type}
    header={
      <WBPlanViewHeader
        title='Select Base Table'
        stateType={state.type}
        buttonsLeft={<label>
          <input
            type='checkbox'
            checked={state.show_hidden_tables}
            onChange={() => state.dispatch({
              type: 'ToggleHiddenTablesAction',
            })}
          />
          Show advanced tables
        </label>}
        buttonsRight={<>
          <button onClick={() => state.dispatch({
            type: 'UseTemplateAction',
            dispatch: state.dispatch,
          })}>Use template
          </button>
          <button onClick={() => state.dispatch({
            type: 'CancelMappingAction',
            dataset: state.props.dataset,
            remove_unload_protect: state.props.remove_unload_protect,
          })}>Cancel
          </button>
        </>}
      />
    }>
    <ListOfBaseTables
      list_of_tables={data_model_storage.list_of_base_tables}
      show_hidden_tables={state.show_hidden_tables}
      handleChange={(
        (table_name: string) => state.dispatch({
          type: 'SelectTableAction',
          table_name,
          mapping_is_templated: state.props.mapping_is_templated,
          headers: state.props.headers,
        })
      )}
    />
  </HeaderWrapper>,
  'TemplateSelectionState': ({action: state}) =>
    <ModalDialog
      properties={{title: 'Select Template'}}
      onCloseCallback={() => state.dispatch({
        type: 'OpenBaseTableSelectionAction',
        referrer: state.type,
      })}
    >{
      state.templates.map(({dataset_name}, index) =>
        <a key={index} onClick={() =>
          state.dispatch({
            type: 'OpenMappingScreenAction',
            upload_plan: state.templates[index].upload_plan,
            mapping_is_templated: state.props.mapping_is_templated,
            headers: state.props.headers,
          })
        }>{dataset_name}</a>,
      )
    }</ModalDialog>,
  'MappingState': ({action: state}) => {
    const refObject = getRefMappingState(
      state.refObject,
      state,
    );

    if (typeof refObject.current.mapping_view_height === 'undefined')
      refObject.current.mapping_view_height = cache.get<number>(
        'ui',
        'mapping_view_height',
        {
          default_value: defaultMappingViewHeight,
        },
      );

    const handleSave = (ignore_validation: boolean) =>
      state.dispatch({
          type: 'SavePlanAction',
          dataset: state.props.dataset,
          remove_unload_protect: state.props.remove_unload_protect,
          set_unload_protect: state.props.set_unload_protect,
          mapping_is_templated: state.mapping_is_templated,
          ignore_validation,
        },
      );
    const handleClose = () => state.dispatch({
      type: 'CloseSelectElementAction',
    });
    const handleMappingOptionsDialogClose = () => state.dispatch({
      type: 'CloseMatchingLogicDialogAction',
    });

    return <HeaderWrapper
      state_name={state.type}
      header={
        <WBPlanViewHeader
          title={
            data_model_storage.tables[
              state.base_table_name
              ].table_friendly_name
          }
          stateType={state.type}
          buttonsLeft={
            <button
              onClick={() => state.dispatch({
                type: 'OpenBaseTableSelectionAction',
              })}
            >Change table</button>
          }
          buttonsRight={<>
            {
              !state.show_mapping_view &&
              <button
                onClick={() =>
                  state.dispatch({
                    type: 'ToggleMappingViewAction',
                  })
                }
              >Show mapping view</button>
            }
            <button
              onClick={() => state.dispatch({
                type: 'OpenMatchingLogicDialogAction',
              })}
            >Matching logic
            </button>
            <button onClick={() => state.dispatch({
              type: 'ResetMappingsAction',
            })}>Clear Mappings
            </button>
            <button onClick={() =>
              void (
                state.dispatch({
                  type: 'ValidationAction',
                })
              ) ||
              void (
                state.refObjectDispatch({
                  type: 'AutoscrollStatusChangeAction',
                  autoscroll_type: 'mapping_view',
                  status: true,
                })
              )
            }>
              Check mappings
              {
                state.mappings_are_validated &&
                <i style={{
                  color: '#4f2',
                  fontSize: '12px',
                }}>✓</i>
              }
            </button>
            <button onClick={
              () => handleSave(false)
            }>Save
            </button>
            <button onClick={() => state.dispatch({
              type: 'CancelMappingAction',
              dataset: state.props.dataset,
              remove_unload_protect: state.props.remove_unload_protect,
            })}>Cancel
            </button>
          </>}
        />
      }
      handleClick={handleClose}
    >
      <WBPlanViewMapper
        mapping_is_templated={state.mapping_is_templated}
        show_hidden_fields={state.show_hidden_fields}
        show_mapping_view={state.show_mapping_view}
        base_table_name={state.base_table_name}
        new_header_id={state.new_header_id}
        lines={state.lines}
        mapping_view={state.mapping_view}
        validation_results={state.validation_results}
        mapper_dispatch={state.dispatch}
        open_select_element={state.open_select_element}
        automapper_suggestions={state.automapper_suggestions}
        focused_line={state.focused_line}
        refObject={refObject}
        handleSave={() => handleSave(true)}
        handleToggleHiddenFields={() =>
          state.dispatch({type: 'ToggleHiddenFieldsAction'})
        }
        handleFocus={(line: number) =>
          state.dispatch({
            type: 'FocusLineAction',
            line,
          })}
        handleMappingViewMap={() =>
          state.dispatch({type: 'MappingViewMapAction'})
        }
        handleAddNewHeader={() =>
          state.dispatch({type: 'AddNewHeaderAction'})
        }
        handleAddNewStaticHeader={() =>
          state.dispatch({type: 'AddNewStaticHeaderAction'})
        }
        handleAddNewColumn={() =>
          state.dispatch({type: 'AddNewHeaderAction'})
        }
        handleAddNewStaticColumn={() =>
          state.dispatch({type: 'AddNewStaticHeaderAction'})
        }
        handleOpen={(line: number, index: number) =>
          state.dispatch({
            type: 'OpenSelectElementAction',
            line,
            index,
          })
        }
        handleClose={handleClose}
        handleChange={(
          line: 'mapping_view' | number,
          index: number,
          value: string,
          is_relationship: boolean,
        ) => state.dispatch({
          type: 'ChangeSelectElementValueAction',
          line,
          index,
          value,
          is_relationship,
        })}
        handleClearMapping={(line: number) =>
          state.dispatch({
            type: 'ClearMappingLineAction',
            line,
          })
        }
        handleStaticHeaderChange={(
          line: number,
          event: React.ChangeEvent<HTMLTextAreaElement>,
        ) => state.dispatch({
          type: 'StaticHeaderChangeAction',
          line,
          event,
        })}
        handleAutomapperSuggestionSelection={(suggestion: string) =>
          state.dispatch({
            type: 'AutomapperSuggestionSelectedAction',
            suggestion,
          })
        }
        handleValidationResultClick={(mapping_path: MappingPath) =>
          state.dispatch({
            type: 'ValidationResultClickAction',
            mapping_path,
          })
        }
        handleToggleMappingIsTemplated={() =>
          state.dispatch({
            type: 'ToggleMappingIsTemplatedAction',
          })
        }
        handleToggleMappingView={() =>
          state.dispatch({type: 'ToggleMappingViewAction'})
        }
        handleMappingViewResize={(height) =>
          state.refObjectDispatch({
            type: 'MappingViewResizeAction',
            height,
          })
        }
        handleAutoscrollStatusChange={(
          autoscroll_type,
          status,
        ) =>
          state.refObjectDispatch({
            type: 'AutoscrollStatusChangeAction',
            autoscroll_type,
            status,
          })}
        handleChangeMatchBehaviorAction={(
          line: number,
          match_behavior: MatchBehaviors,
        )=>state.dispatch({
          type: 'ChangeMatchBehaviorAction',
          line,
          match_behavior: match_behavior
        })}
        handleToggleAllowNullsAction={(
          line: number,
          allow_null: boolean,
        )=>state.dispatch({
          type: 'ToggleAllowNullsAction',
          line,
          allow_null
        })}
        handleChangeDefaultValue={(
          line: number,
          default_value: string|null,
        )=>state.dispatch({
          type: 'ChangeDefaultValue',
          line,
          default_value
        })}
      />
      {
        state.display_matching_options_dialog ?
          <ModalDialog
            onCloseCallback={handleMappingOptionsDialogClose}
            properties={{
              title: 'Change Matching Logic',
              buttons: {
                'Done': handleMappingOptionsDialogClose,
              },
            }}
          >
            <table>
              <thead>
              <tr>
                <th>Table Name</th>
                <th>Must Match</th>
              </tr>
              </thead>
              <tbody>{
                Object.entries(
                  state.must_match_preferences,
                ).map(([table_name, must_match]) => <tr
                  key={table_name}
                >
                  <td>
                    <div className='must_match_line'>
                      <Icon
                        table_name={table_name}
                        option_label={table_name}
                        is_relationship={true}
                      />
                      {data_model_storage.tables[
                        table_name
                        ].table_friendly_name}
                    </div>
                  </td>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        checked={must_match}
                        onChange={() => state.dispatch({
                          type: 'MustMatchPrefChangeAction',
                          table_name,
                          must_match: !must_match,
                        })}
                      />
                    </label>
                  </td>
                </tr>)
              }</tbody>
            </table>
          </ModalDialog> :
          null
      }
    </HeaderWrapper>;
  },
});


type RefUndefinedState = State<'RefUndefinedState'>;
export type AutoScrollTypes =
  'list_of_mappings'
  | 'mapping_view';

export interface RefMappingState extends State<'RefMappingState'> {
  unload_protect_is_set: boolean,
  mapping_view_height: number,
  mapping_view_height_change_timeout: NodeJS.Timeout,
  autoscroll: Record<AutoScrollTypes, boolean>,
}

type RefStatesBase = RefUndefinedState | RefMappingState;
// make all properties optional, except for `type`
type RefStates = Partial<RefStatesBase> & State<RefStatesBase['type']>;

const refInitialState: RefUndefinedState = {
  type: 'RefUndefinedState',
};

const refStatesMapper = {
  'MappingState': 'RefMappingState',
} as const;
const flippedRefStatesMapper = Object.fromEntries(
  Object.entries(refStatesMapper).map(([k, v]) =>
    [v, k],
  ),
);

type RefChangeStateAction = Action<'RefChangeStateAction'>;
type RefSetUnloadProtectAction = Action<'RefSetUnloadProtectAction'>;
type RefUnsetUnloadProtectAction = Action<'RefUnsetUnloadProtectAction'>;

interface MappingViewResizeAction
  extends Action<'MappingViewResizeAction'> {
  height: number;
}

interface AutoscrollStatusChangeAction
  extends Action<'AutoscrollStatusChangeAction'> {
  autoscroll_type: AutoScrollTypes,
  status: boolean,
}

type RefActions =
  RefChangeStateAction
  | RefSetUnloadProtectAction
  | RefUnsetUnloadProtectAction
  | MappingViewResizeAction
  | AutoscrollStatusChangeAction;

type RefActionsWithPayload = RefActions & {
  payload: {
    refObject: React.MutableRefObject<RefStates>,
    state: WBPlanViewStates,
    stateDispatch: (action: WBPlanViewActions) => void,
    props: WBPlanViewProps,
  }
};

function getRefMappingState(
  refObject: React.MutableRefObject<RefStates>,
  state: WBPlanViewStates,
  quiet = false,
): React.MutableRefObject<RefMappingState> {

  const refWrongStateMessage = 'Tried to change the refObject while' +
    'in a wrong state';

  if (state.type !== flippedRefStatesMapper[refObject.current.type])
    if (quiet)
      console.error(refWrongStateMessage);
    else
      throw Error(refWrongStateMessage);

  return refObject as React.MutableRefObject<RefMappingState>;

}

const ref_object_dispatch = generate_dispatch<RefActionsWithPayload>({
  'RefChangeStateAction': ({
    payload: {
      refObject,
      state,
    },
  }) => {
    refObject.current = {
      type: refStatesMapper[
        state.type as keyof typeof refStatesMapper
        ] ?? 'RefUndefinedState',
    };
  },
  'RefSetUnloadProtectAction': ({
    payload: {
      refObject,
      props,
      state,
    },
  }) => {
    props.remove_unload_protect();
    getRefMappingState(
      refObject,
      state,
    ).current.unload_protect_is_set = false;
  },
  'RefUnsetUnloadProtectAction': ({
    payload: {
      refObject,
      props,
      state,
    },
  }) => {
    props.remove_unload_protect();
    getRefMappingState(
      refObject,
      state,
    ).current.unload_protect_is_set = false;
  },
  'MappingViewResizeAction': ({
    height: initialHeight,
    payload: {
      refObject,
      state,
      stateDispatch,
    },
  }) => {
    const refMappingObject = getRefMappingState(
      refObject,
      state,
    );

    if (refMappingObject.current.mapping_view_height_change_timeout)
      clearTimeout(
        refMappingObject.current.mapping_view_height_change_timeout,
      );

    let height = initialHeight;
    if (initialHeight <= minMappingViewHeight) {
      height = minMappingViewHeight + 1;
      stateDispatch({
        type: 'ToggleMappingViewAction',
      });
    }

    refMappingObject.current.mapping_view_height = height;
    refMappingObject.current.mapping_view_height_change_timeout =
      setTimeout(
        () =>
          cache.set(
            'ui',
            'mapping_view_height',
            height,
            {
              overwrite: true,
            },
          ),
        150,
      );
  },
  'AutoscrollStatusChangeAction': ({
    autoscroll_type,
    status,
    payload: {
      refObject,
      state,
    },
  }) => {
    const refMappingObject = getRefMappingState(
      refObject,
      state,
    );

    refMappingObject.current.autoscroll ??= {
      mapping_view: false,
      list_of_mappings: false,
    };
    refMappingObject.current.autoscroll[autoscroll_type] = status;
  },
});


function WBPlanView(props: WBPlanViewProps) {

  const [state, dispatch] = React.useReducer(
    reducer,
    {
      upload_plan: props.upload_plan,
      headers: props.headers,
      mapping_is_templated: props.mapping_is_templated,
    } as OpenMappingScreenAction,
    getInitialWBPlanViewState,
  );

  // `refObject` is like `state`, but does not cause re-render on change
  const refObject = React.useRef<RefStates>(refInitialState);
  const refObjectDispatch = (action: RefActions) =>
    ref_object_dispatch({
      ...action,
      payload: {
        refObject,
        state,
        props,
        stateDispatch: dispatch,
      },
    });

  // reset refObject on state change
  if (
    refObject.current.type !== (
      // @ts-ignore
      refStatesMapper[state.type] ?? 'RefUndefinedState'
    )
  )
    refObjectDispatch({
      type: 'RefChangeStateAction',
    });

  // set/unset unload protect
  React.useEffect(() => {
    const changes_made = 'changes_made' in state ?
      state.changes_made :
      false;

    if (
      state.type === 'LoadingState' ||
      refObject.current.type !== 'RefMappingState'
    )
      return;

    if (refObject.current.unload_protect_is_set && !changes_made)
      refObjectDispatch({
        type: 'RefUnsetUnloadProtectAction',
      });
    else if (!refObject.current.unload_protect_is_set && changes_made)
      refObjectDispatch({
        type: 'RefSetUnloadProtectAction',
      });

  }, [
    'changes_made' in state ?
      state.changes_made :
      false,
  ]);

  // wait for automapper suggestions to fetch
  React.useEffect(() => {

    if (!(
      'automapper_suggestions_promise' in state
    ))
      return;

    state.automapper_suggestions_promise?.then(automapper_suggestions =>
      dispatch({
        type: 'AutomapperSuggestionsLoadedAction',
        automapper_suggestions,
      }),
    ).catch(console.error);

  }, [
    'automapper_suggestions_promise' in state ?
      state.automapper_suggestions_promise :
      undefined,
  ]);

  return state_reducer(<i />, {
    ...state,
    props,
    dispatch,
    refObject,
    refObjectDispatch,
  });

}

function WBPlanViewWrapper(props: WBPlanViewWrapperProps): JSX.Element {

  const [schema_loaded, setSchemaLoaded] =
    React.useState<boolean>(
      typeof data_model_storage.tables !== 'undefined',
    );

  React.useEffect(() => {
    if (schema_loaded)
      return;

    schema_fetched_promise.then(() =>
      setSchemaLoaded(true),
    ).catch(error => {
      throw error;
    });

  }, [schema_loaded]);

  const upload_plan = props.dataset.uploadplan ?
    props.dataset.uploadplan :
    false;
  return (
    schema_loaded ?
      <WBPlanView {...props} upload_plan={upload_plan}
        headers={props.dataset.columns} />
      : <LoadingScreen />
  );
}


const set_unload_protect = (self: WBPlanViewBackboneProps) =>
  navigation.addUnloadProtect(
    self,
    'This mapping has not been saved.',
  );

const remove_unload_protect = (self: WBPlanViewBackboneProps) =>
  navigation.removeUnloadProtect(self);

export default createBackboneView<PublicWBPlanViewProps,
  WBPlanViewBackboneProps,
  WBPlanViewWrapperProps>
({
  module_name: 'WBPlanView',
  title: (self) =>
    self.dataset.name,
  class_name: 'wb-plan-view',
  initialize(
    self,
    {dataset},
  ) {
    self.dataset = dataset;
    self.mapping_is_templated = false;
    const header = document.getElementById('site-header');
    if (header === null)
      throw new Error(`Can't find site's header`);
    self.header = header;
    self.handle_resize = () =>
      self.el.style.setProperty(
        '--menu_size',
        `${Math.ceil(self.header.clientHeight)}px`,
      );
  },
  render_pre(self) {
    self.el.classList.add('wbplanview');
  },
  render_post(self) {
    self.handle_resize();
    window.addEventListener('resize', self.handle_resize);
  },
  remove(self) {
    window.removeEventListener('resize', self.handle_resize);
    remove_unload_protect(self);
  },
  Component: WBPlanViewWrapper,
  get_component_props: self => (
    {
      dataset: self.dataset,
      remove_unload_protect:
        remove_unload_protect.bind(null, self),
      set_unload_protect:
        set_unload_protect.bind(null, self),
      mapping_is_templated: self.mapping_is_templated,
    }
  ),
});
