/**
 * Fetch basic SpecifyUser information
 */

import type { Agent, Collection, SpecifyUser } from '../DataModel/types';
import { serializeResource } from '../DataModel/helpers';
import { load } from './index';
import { fetchContext as fetchSchema } from '../DataModel/schema';
import type { RA, Writable } from '../../utils/types';
import { setDevelopmentGlobal } from '../../utils/types';
import { SerializedModel, SerializedResource } from '../DataModel/helperTypes';
import { LocalizedString } from 'typesafe-i18n';

export type UserInformation = SerializedModel<SpecifyUser> & {
  readonly name: LocalizedString;
  readonly isauthenticated: boolean;
  readonly availableCollections: RA<SerializedResource<Collection>>;
  readonly agent: SerializedModel<Agent>;
};

const userInfo: Writable<UserInformation> = {} as UserInformation;

export const fetchContext = load<
  Omit<UserInformation, 'availableCollections'> & {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly available_collections: RA<SerializedModel<Collection>>;
  }
>('/context/user.json', 'application/json').then(
  async ({ available_collections: availableCollections, ...data }) => {
    Object.entries(data).forEach(([key, value]) => {
      // @ts-expect-error
      userInfo[key as keyof UserInformation] = value;
    });
    return fetchSchema.then(() => {
      userInfo.availableCollections =
        availableCollections.map(serializeResource);
      setDevelopmentGlobal('_user', userInfo);
    });
  }
);

export const userInformation: UserInformation = userInfo;
