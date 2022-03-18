import React from 'react';

import type { RecordSet } from '../datamodel';
import type { SpecifyResource } from '../legacytypes';
import { schema } from '../schema';
import type { RA } from '../types';
import { defined } from '../types';
import { userInformation } from '../userinfo';
import { FormTableCollection } from './formtable';
import { InteractionDialog } from './interactiondialog';

export function FormTableInteraction(
  props: Omit<Parameters<typeof FormTableCollection>[0], 'onAdd'>
): JSX.Element {
  const [recordSetsPromise, setRecordSetsPromise] = React.useState<
    | Promise<{
        readonly recordSets: RA<SpecifyResource<RecordSet>>;
        readonly totalCount: number;
      }>
    | undefined
  >(undefined);
  return (
    <>
      {typeof recordSetsPromise === 'object' && (
        <InteractionDialog
          action={{ model: defined(props.collection.related).specifyModel }}
          model={schema.models.CollectionObject}
          interactionresource={props.collection.related}
          itemCollection={props.collection}
          recordSetsPromise={recordSetsPromise}
          onClose={(): void => setRecordSetsPromise(undefined)}
        />
      )}
      <FormTableCollection
        {...props}
        onAdd={(): void => {
          const recordSets = new schema.models.RecordSet.LazyCollection({
            filters: {
              specifyuser: userInformation.id,
              type: 0,
              dbtableid: 1,
              domainfilter: true,
              orderby: '-timestampcreated',
            },
          });
          setRecordSetsPromise(
            recordSets
              .fetchPromise({ limit: 5000 })
              .then(({ models, _totalCount }) => ({
                recordSets: models,
                totalCount: defined(_totalCount),
              }))
          );
        }}
      />
    </>
  );
}
