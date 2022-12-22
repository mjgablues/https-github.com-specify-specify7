import React from 'react';

import type { GetOrSet, GetSet } from '../../utils/types';
import type { preferenceDefinitions, Preferences } from './Definitions';
import { getPref, getUserPref, setPref } from './helpers';
import { PreferencesContext, prefEvents } from './Hooks';

/**
 * React Hook to listen to preferences changes
 * (this allows to change UI preferences without restarting the application)
 */
export function usePref<
  CATEGORY extends keyof Preferences,
  SUBCATEGORY extends CATEGORY extends keyof typeof preferenceDefinitions
    ? keyof Preferences[CATEGORY]['subCategories']
    : never,
  ITEM extends keyof Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items']
>(
  category: CATEGORY,
  subcategory: SUBCATEGORY,
  item: ITEM
): GetOrSet<
  Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
> {
  const preferenceType = 'userPreferences';
  const [getPrefMain, setUserPref] = React.useContext(PreferencesContext) ?? [
    getPref[preferenceType],
    setPref[preferenceType],
  ];

  const [pref, setLocalPref] = React.useState<
    Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
  >(() => getPrefMain(category, subcategory, item));

  const currentPref = React.useRef(pref);

  const updatePref = React.useCallback(
    (
      newPref:
        | Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
        | ((
            oldPref: Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
          ) => Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue'])
    ): void => {
      let x =
        typeof newPref === 'function'
          ? (
              newPref as (
                oldPref: Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
              ) => Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
            )(currentPref.current)
          : newPref;

      const newValue = setUserPref(category, subcategory, item, x);
      if (newValue === currentPref.current) return;
      setLocalPref(newValue);
      currentPref.current = newValue;
    },
    [category, subcategory, item]
  );

  return [pref, updatePref] as const;
}
