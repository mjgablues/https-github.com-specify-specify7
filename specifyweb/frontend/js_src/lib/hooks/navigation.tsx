/**
 * A wrapper for Backbone's routing API
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LocalizedString } from 'typesafe-i18n';

import { UnloadProtectsContext } from '../components/Core/Contexts';
import { formatUrl, parseUrl } from '../components/Router/queryString';
import { locationToUrl } from '../components/Router/Router';
import { useStableLocation } from '../components/Router/RouterState';
import type { GetOrSet, GetSet, RA } from '../utils/types';
import { removeItem, removeKey } from '../utils/utils';

export function useSearchParameter(
  name: string | undefined,
  stable = true
): GetSet<string | undefined> {
  const location = useLocation();
  const stableLocation = useStableLocation(location);
  /*
   * If non-overlay listens for a query string, and you open an overlay, the
   * previous query string value should be used
   */
  const resolvedLocation = stable ? stableLocation : location;
  const url = locationToUrl(resolvedLocation);
  const parameters = React.useMemo(() => parseUrl(url), [url]);
  const value = parameters[name ?? ''];
  const navigate = useNavigate();

  const handleChange = useFunction((value: string | undefined): void => {
    if (name === undefined)
      throw new Error('Tried to change query string without providing a name');
    navigate(
      formatUrl(
        url,
        value === undefined
          ? removeKey(parameters, name)
          : {
              ...parameters,
              [name]: value,
            }
      ),
      { replace: true, state: location.state }
    );
  });

  return [value, handleChange];
}

/**
 * Create a callback that is always using the value from the most recent
 * render, without causing re-render
 * FEATURE: use this in more places
 */
function useFunction<TYPE extends (...args: RA<never>) => unknown>(
  callback: TYPE
): TYPE {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;
  return React.useCallback<TYPE>(
    ((...args) => callbackRef.current(...args)) as TYPE,
    []
  );
}

export function useUnloadProtect(
  isEnabled: boolean,
  message: LocalizedString
): () => void {
  const [_unloadProtects, setUnloadProtects] = React.useContext(
    UnloadProtectsContext
  )!;

  const handleRemove = React.useCallback(
    (): void => unsetUnloadProtect(setUnloadProtects, message),
    [setUnloadProtects, message]
  );

  React.useEffect(() => {
    if (!isEnabled) return undefined;
    setUnloadProtects((unloadProtects) => [...unloadProtects, message]);
    return handleRemove;
  }, [setUnloadProtects, isEnabled, message]);

  return React.useCallback(
    () => (isEnabled ? handleRemove() : undefined),
    [setUnloadProtects, isEnabled]
  );
}

export const unsetUnloadProtect = (
  setUnloadProtects: GetOrSet<RA<string>>[1],
  message: LocalizedString
) =>
  setUnloadProtects((unloadProtects) => {
    const index = unloadProtects.indexOf(message);
    if (index === -1) return unloadProtects;

    /*
     * If there are multiple unload protects with the same message, this makes
     * sure to remove only one
     */
    return removeItem(unloadProtects, index);
  });
