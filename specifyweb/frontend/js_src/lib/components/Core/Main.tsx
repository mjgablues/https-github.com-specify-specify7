/**
 * The root React wrapper for the app
 */

import React from 'react';

import { enableBusinessRules } from '../DataModel/businessRules';
import { commonText } from '../../localization/common';
import type { MenuItemName } from '../Header/menuItemDefinitions';
import { menuItemsPromise } from '../Header/menuItemDefinitions';
import { getSystemInfo } from '../InitialContext/systemInfo';
import type { RR } from '../../utils/types';
import { userInformation } from '../InitialContext/userInformation';
import { ErrorBoundary } from '../Errors/ErrorBoundary';
import { CollectionSelector, ExpressSearch, HeaderItems } from '../Header';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { Notifications } from '../Header/Notifications';
import type { Preferences } from '../UserPreferences/Definitions';
import { Router } from '../Router/Router';
import { UserTools } from '../Header/UserTools';
import { Button } from '../Atoms/Button';
import { className } from '../Atoms/className';
import { Link } from '../Atoms/Link';
import { crash } from '../Errors/Crash';

export type UserTool = {
  readonly title: string;
  readonly url: string;
  readonly enabled?: () => Promise<boolean> | boolean;
};

export type MenuItem = UserTool & {
  readonly icon: JSX.Element;
  readonly visibilityKey: keyof Preferences['header']['subCategories']['menu']['items'];
};

/*
 * REFACTOR: move UI logic out of .ts files and into .tsx (e.i., fetching data
 *  should be done in .tsx files so that a Loading Dialog can be displayed)
 */

export function Main(): JSX.Element | null {
  const [menuItems, setMenuItems] = React.useState<
    RR<MenuItemName, MenuItem> | undefined
  >(undefined);
  const [showVersionMismatch, setShowVersionMismatch] = React.useState(
    getSystemInfo().specify6_version !== getSystemInfo().database_version
  );

  const [hasAgent] = React.useState(userInformation.agent !== null);

  const mainRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(
    () =>
      void menuItemsPromise
        .then(setMenuItems)
        .then(() => enableBusinessRules(true))
        .then(console.groupEnd)
        .catch(crash),
    []
  );

  return menuItems === undefined ? null : (
    <>
      <Button.Small
        className="sr-only !absolute top-0 left-0 z-10 !p-2 focus:not-sr-only"
        onClick={(): void => {
          if (!mainRef.current) return;
          mainRef.current.setAttribute('tabindex', '-1');
          mainRef.current.focus();
          mainRef.current.removeAttribute('tabindex');
        }}
      >
        {commonText('skipToContent')}
      </Button.Small>

      <header
        className={`
          flex flex-col border-b-[5px]
          border-b-brand-200 bg-gray-200 shadow-md shadow-gray-400 [z-index:1] 
          dark:border-b-brand-400 dark:bg-neutral-800 print:hidden 2xl:flex-row
          ${className.hasAltBackground}
        `}
      >
        <div className="flex w-full items-center justify-between 2xl:contents">
          <h1 className="contents">
            <a
              className="order-1 m-4 flex items-center"
              href="/specifyweb/frontend/js_src/lib/components/Core/Main"
            >
              <img
                alt=""
                className="h-16 hover:animate-hue-rotate"
                src="/static/img/seven_logo.png"
              />
              <span className="sr-only">{commonText('goToHomepage')}</span>
            </a>
          </h1>
          <div
            className={`
              2xl:w-max-[350px] order-3 m-4 flex min-w-[275px] flex-col gap-2
            `}
          >
            <div className="flex items-center justify-end gap-2">
              {/* FEATURE: display user tools for anonymous users */}
              {userInformation.isauthenticated ? (
                <UserTools />
              ) : (
                <Link.Default href="/accounts/login/">
                  {commonText('logIn')}
                </Link.Default>
              )}
              <CollectionSelector />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Notifications />
              <ExpressSearch />
            </div>
          </div>
        </div>
        <HeaderItems menuItems={menuItems} />
      </header>

      {showVersionMismatch && (
        <Dialog
          buttons={
            <Button.Orange onClick={(): void => setShowVersionMismatch(false)}>
              {commonText('close')}
            </Button.Orange>
          }
          forceToTop
          header={commonText('versionMismatchDialogHeader')}
          onClose={(): void => setShowVersionMismatch(false)}
        >
          <p>
            {commonText(
              'versionMismatchDialogText',
              getSystemInfo().specify6_version,
              getSystemInfo().database_version
            )}
          </p>
          <p>{commonText('versionMismatchSecondDialogText')}</p>
        </Dialog>
      )}
      {hasAgent ? (
        <main className="flex-1 overflow-auto" ref={mainRef}>
          <ErrorBoundary dismissable>
            <Router />
          </ErrorBoundary>
        </main>
      ) : (
        <Dialog
          buttons={
            <Button.DialogClose component={Button.Red}>
              {commonText('logOut')}
            </Button.DialogClose>
          }
          className={{
            container: `${dialogClassNames.narrowContainer}`,
          }}
          forceToTop
          header={commonText('noAgentDialogHeader')}
          onClose={(): void => globalThis.location.assign('/accounts/logout/')}
        >
          {commonText('noAgentDialogText')}
        </Dialog>
      )}
    </>
  );
}
