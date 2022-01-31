import React from 'react';

import type { RecordSet, SpQuery } from '../datamodel';
import type { SpecifyResource } from '../legacytypes';
import queryText from '../localization/query';
import NotFoundView from '../notfoundview';
import queryFromTree from '../queryfromtree';
import * as querystring from '../querystring';
import router from '../router';
import { getModel } from '../schema';
import schema from '../schemabase';
import * as app from '../specifyapp';
import { setCurrentView } from '../specifyapp';
import { defined } from '../types';
import userInfo from '../userinfo';
import dataModelStorage from '../wbplanviewmodel';
import { dataModelPromise } from '../wbplanviewmodelfetcher';
import { crash } from './errorboundary';
import { LoadingScreen } from './modaldialog';
import { QueryBuilder } from './querybuilder';
import createBackboneView from './reactbackboneextend';

function useQueryRecordSet(): SpecifyResource<RecordSet> | undefined | false {
  const [recordSet, setRecordSet] = React.useState<
    SpecifyResource<RecordSet> | undefined | false
  >(undefined);
  React.useEffect(() => {
    const recordSetId = querystring.parse().recordsetid;
    if (typeof recordSetId === 'undefined') {
      setRecordSet(false);
      return;
    }
    const recordSet = new schema.models.RecordSet.LazyCollection({
      filters: { id: Number.parseInt(recordSetId) },
    });
    recordSet
      .fetch()
      .then(({ models }) => setRecordSet(models[0]), console.error);
  }, []);

  return recordSet;
}

function QueryBuilderWrapper({
  query,
  recordSet,
}: {
  query: SpecifyResource<SpQuery>;
  recordSet?: SpecifyResource<RecordSet> | false;
}) {
  const [isLoading, setIsLoading] = React.useState(
    typeof dataModelStorage.tables === 'undefined'
  );
  React.useEffect(() => {
    dataModelPromise.then(() => setIsLoading(false)).catch(crash);
  }, []);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <QueryBuilder
      query={query}
      readOnly={userInfo.isReadOnly}
      model={defined(getModel(query.get('contextName')))}
      recordSet={typeof recordSet === 'object' ? recordSet : undefined}
    />
  );
}

function QueryBuilderById({
  queryId,
}: {
  readonly queryId: number;
}): JSX.Element {
  const [query, setQuery] = React.useState<SpecifyResource<SpQuery>>();
  const recordSet = useQueryRecordSet();
  React.useEffect(() => {
    const query = new schema.models.SpQuery.Resource({ id: queryId });
    query.fetch().then(setQuery, app.handleError);
  }, [queryId]);

  return typeof query === 'undefined' || typeof recordSet === 'undefined' ? (
    <LoadingScreen />
  ) : (
    <QueryBuilderWrapper query={query} recordSet={recordSet} />
  );
}

const QueryById = createBackboneView(QueryBuilderById);

function NewQuery({ tableName }: { readonly tableName: string }): JSX.Element {
  const [query, setQuery] = React.useState<
    SpecifyResource<SpQuery> | undefined
  >(undefined);
  const recordSet = useQueryRecordSet();

  React.useEffect(() => {
    const query = new schema.models.SpQuery.Resource();
    const model = getModel(tableName);
    if (typeof model === 'undefined') {
      setCurrentView(new NotFoundView());
      return;
    }

    query.set('name', queryText('newQueryName'));
    query.set('contextName', model.name);
    query.set('contextTableId', model.tableId);
    query.set('selectDistinct', false);
    query.set('countOnly', false);
    query.set('formatAuditRecIds', false);
    query.set('specifyUser', userInfo.resource_uri);
    query.set('isFavorite', true);
    /*
     * Ordinal seems to always get set to 32767 by Specify 6
     * needs to be set for the query to be visible in Specify 6
     */
    query.set('ordinal', 32_767);
    setQuery(query);
  }, [tableName]);

  return typeof query === 'undefined' || typeof recordSet === 'undefined' ? (
    <LoadingScreen />
  ) : (
    <QueryBuilderWrapper query={query} recordSet={recordSet} />
  );
}

const NewQueryView = createBackboneView(NewQuery);

function QueryBuilderFromTree({
  tableName,
  nodeId,
}: {
  readonly tableName: string;
  readonly nodeId: number;
}): JSX.Element {
  const [query, setQuery] = React.useState<
    SpecifyResource<SpQuery> | undefined
  >(undefined);

  React.useEffect(
    // TODO: convert to react
    () => queryFromTree(userInfo, tableName, nodeId).then(setQuery),
    [tableName, nodeId]
  );

  return typeof query === 'undefined' ? (
    <LoadingScreen />
  ) : (
    <QueryBuilderWrapper query={query} />
  );
}

const QueryFromTree = createBackboneView(QueryBuilderFromTree);

export default function Routes(): void {
  router.route('newQuery/:id/', 'storedQuery', (id) =>
    app.setCurrentView(new QueryById({ queryId: Number.parseInt(id) }))
  );
  router.route('newQuery/new/:table/', 'ephemeralQuery', (tableName) =>
    app.setCurrentView(new NewQueryView({ tableName }))
  );
  router.route(
    'newQuery/fromtree/:table/:id/',
    'queryFromTree',
    (tableName, nodeId) =>
      app.setCurrentView(
        new QueryFromTree({
          tableName,
          nodeId: Number.parseInt(nodeId),
        })
      )
  );
}
