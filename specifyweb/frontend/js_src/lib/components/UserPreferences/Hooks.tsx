import React from 'react';

import { eventListener } from '../../utils/events';
import type { PreferenceItem } from './Definitions';
import type { setPref } from './helpers';
import { getUserPref } from './helpers';
import { usePref } from './usePref';

export const prefEvents = eventListener<{
  readonly update:
    | {
        readonly category: string;
        readonly subcategory: string;
        readonly item: string;
        readonly definition: PreferenceItem<unknown>;
      }
    | undefined;
  readonly synchronized: undefined;
}>();

/*
 * This allows to overwrite where user preferences are stored
 * Used when editing user preferences for another user in AppResources
 */
export const PreferencesContext = React.createContext<
  | readonly [getUserPref: typeof getUserPref, setPref: typeof setPref]
  | undefined
>(undefined);
PreferencesContext.displayName = 'PreferencesContext';

function useMedia(query: string): boolean {
  const media = React.useMemo(() => globalThis.matchMedia(query), [query]);
  const eventsTarget = React.useMemo(
    () => eventListener<{ readonly change: undefined }>(media),
    [media]
  );
  const [matches, setMatches] = React.useState(media.matches);
  React.useEffect(
    () => eventsTarget.on('change', () => setMatches(media.matches), true),
    [eventsTarget, media]
  );
  return matches;
}

export function useReducedMotion(): boolean {
  const [pref] = usePref('general', 'ui', 'reduceMotion');
  const media = useMedia('(prefers-reduced-motion: reduce)');
  return pref === 'system' ? media : pref === 'reduce';
}

export function useHighContrast(): boolean {
  const [pref] = usePref('general', 'ui', 'contrast');
  const media = useMedia('(prefers-contrast: more)');
  return pref === 'system' ? media : pref === 'more';
}

const defaultTransitionDuration = 100;

export function useTransitionDuration(): number {
  const reduceMotion = useReducedMotion();
  return React.useMemo(
    () => (reduceMotion ? 0 : defaultTransitionDuration),
    [reduceMotion]
  );
}

function shouldReduceMotion(): boolean {
  const pref = getUserPref('general', 'ui', 'reduceMotion');
  return pref === 'system'
    ? globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    : pref === 'reduce';
}

export const getTransitionDuration = (): number =>
  shouldReduceMotion() ? 0 : defaultTransitionDuration;

export function useDarkMode(): boolean {
  const [theme] = usePref('general', 'ui', 'theme');
  const media = useMedia('(prefers-color-scheme: dark)');
  return theme === 'system' ? media : theme === 'dark';
}

export function useReducedTransparency(): boolean {
  const [reduceTransparency] = usePref('general', 'ui', 'reduceTransparency');
  const media = useMedia('(prefers-reduced-transparency: reduce)');
  return reduceTransparency === 'system'
    ? media
    : reduceTransparency === 'reduce';
}
