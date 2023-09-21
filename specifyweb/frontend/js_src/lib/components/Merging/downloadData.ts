import { valuesToTest } from './runTest';
import { fetchResource } from '../DataModel/resource';
import { autoMerge, postMergeResource } from './autoMerge';
import { schema } from '../DataModel/schema';
import { deserializeResource } from '../DataModel/helpers';
import { AnySchema, SerializedResource } from '../DataModel/helperTypes';
import { filterArray, RA } from '../../utils/types';
import { downloadFile } from '../Molecules/FilePicker';
import { collectionPreferences } from '../Preferences/collectionPreferences';

export type MergeRowTEST = [number, RA<number>];
export type MergeRowDataTEST = {
  readonly newId: number;
  readonly oldIds: RA<number>;
  readonly newRecordData: string | undefined;
};
export async function downloadData() {
  let finalData: RA<MergeRowDataTEST> = [];
  let counter = 0;
  const dataToTest =
    collectionPreferences.get('recordMerging', 'test', 'testItems') ??
    valuesToTest;
  for (const [targetId, clonesId] of dataToTest) {
    const targetResource = await fetchResource('Agent', targetId, false);
    const cloneResources = await Promise.all(
      clonesId.map((id) => fetchResource('Agent', id, false))
    );
    const all = [targetResource, ...cloneResources];
    const filtered = filterArray(all) as unknown as RA<
      SerializedResource<AnySchema>
    >;
    if (all.length !== filtered.length) {
      finalData = [
        ...finalData,
        {
          newId: targetId,
          oldIds: clonesId.map((id) => id),
          newRecordData: undefined,
        },
      ];
      continue;
    }
    const merged = await postMergeResource(
      filtered,
      autoMerge(schema.models.Agent, filtered, false, targetResource!.id)
    ).then((merged) =>
      deserializeResource(merged as SerializedResource<AnySchema>)
    );
    const newData = JSON.stringify(merged.toJSON());
    finalData = [
      ...finalData,
      {
        newId: targetId,
        oldIds: clonesId.map((id) => id),
        newRecordData: newData,
      },
    ];
    collectionPreferences.set('recordMerging', 'test', 'testData', finalData);
    console.log('on index: ', counter++);
  }
  await downloadFile('dataFor Merge', JSON.stringify(finalData));
}
