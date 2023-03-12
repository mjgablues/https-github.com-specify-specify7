import React from 'react';

import { useErrorContext } from '../../hooks/useErrorContext';
import { formsText } from '../../localization/forms';
import { localityText } from '../../localization/locality';
import { defined } from '../../utils/types';
import { getUniqueName } from '../../utils/uniquifyName';
import { Button } from '../Atoms/Button';
import { Form } from '../Atoms/Form';
import { icons } from '../Atoms/Icons';
import { LoadingContext, ReadOnlyContext } from '../Core/Contexts';
import { toTable } from '../DataModel/helpers';
import type { SerializedResource } from '../DataModel/helperTypes';
import { createResource } from '../DataModel/resource';
import {
  deserializeResource,
  serializeResource,
} from '../DataModel/serializers';
import type {
  SpAppResource,
  SpAppResourceData,
  SpAppResourceDir,
  SpViewSetObj as SpViewSetObject,
} from '../DataModel/types';
import { useResourceView } from '../Forms/BaseResourceView';
import { DeleteButton } from '../Forms/DeleteButton';
import { SaveButton } from '../Forms/Save';
import { AppTitle } from '../Molecules/AppTitle';
import { hasToolPermission } from '../Permissions/helpers';
import { isOverlay, OverlayContext } from '../Router/Router';
import { isXmlSubType } from './Create';
import {
  AppResourceDownload,
  AppResourceEditButton,
  appResourceIcon,
  AppResourceLoad,
} from './EditorComponents';
import { getResourceType } from './filtersHelpers';
import { useAppResourceData } from './hooks';
import { AppResourcesTabs } from './Tabs';

export function AppResourceEditor({
  resource,
  directory,
  initialData,
  onSaved: handleSaved,
  onClone: handleClone,
  onDeleted: handleDeleted,
  children,
}: {
  readonly resource: SerializedResource<SpAppResource | SpViewSetObject>;
  readonly directory: SerializedResource<SpAppResourceDir>;
  readonly initialData: string | undefined;
  readonly onDeleted: (() => void) | undefined;
  readonly onClone:
    | ((
        resource: SerializedResource<SpAppResource | SpViewSetObject>,
        initialData: number | undefined
      ) => void)
    | undefined;
  readonly onSaved: (
    resource: SerializedResource<SpAppResource | SpViewSetObject>,
    directory: SerializedResource<SpAppResourceDir>
  ) => void;
  readonly children: (renderProps: {
    readonly headerString: string;
    readonly headerJsx: JSX.Element;
    readonly headerButtons: JSX.Element;
    readonly form: JSX.Element;
    readonly footer: JSX.Element;
  }) => JSX.Element;
}): JSX.Element | null {
  const appResource = React.useMemo(
    () => deserializeResource(resource),
    [resource]
  );
  useErrorContext('appResource', resource);

  const {
    resourceData: [resourceData, setResourceData],
    isChanged,
  } = useAppResourceData(resource, initialData);
  useErrorContext('resourceData', resourceData);

  const [formElement, setForm] = React.useState<HTMLFormElement | null>(null);
  const isReadOnly =
    React.useContext(ReadOnlyContext) ||
    !hasToolPermission('resources', appResource.isNew() ? 'create' : 'update');

  const loading = React.useContext(LoadingContext);

  const showValidationRef = React.useRef<(() => void) | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const syncData = React.useCallback(() => {
    const getData = lastData.current;
    if (typeof getData === 'function')
      setResourceData((resourceData) => ({
        ...defined(resourceData, 'App Resource Data is not defined'),
        data: getData(),
      }));
  }, []);
  const handleChangeFullScreen = React.useCallback(
    (value: boolean) => {
      setIsFullScreen(value);
      syncData();
    },
    [setResourceData]
  );

  const { title, formatted, form } = useResourceView({
    isLoading: false,
    isSubForm: false,
    mode: 'edit',
    resource: appResource,
  });
  const isInOverlay = isOverlay(React.useContext(OverlayContext));
  const headerButtons = (
    <div className="flex flex-wrap gap-3">
      {!isInOverlay && (
        <Button.Blue
          aria-label={localityText.toggleFullScreen()}
          aria-pressed={isFullScreen}
          title={localityText.toggleFullScreen()}
          onClick={(): void => handleChangeFullScreen(!isFullScreen)}
        >
          {isFullScreen ? icons.arrowsCollapse : icons.arrowsExpand}
        </Button.Blue>
      )}
      <span className="-ml-4 md:flex-1" />
      {typeof resourceData === 'object' && (
        <AppResourceLoad
          onLoaded={(data: string, mimeType: string): void => {
            lastData.current = data;
            setResourceData({
              ...resourceData,
              data,
            });
            const resource = toTable(appResource, 'SpAppResource');
            if (typeof resource === 'object' && mimeType !== '') {
              const currentType = resource.get('mimeType') ?? '';
              // Don't widen the type unnecessarily
              if (isXmlSubType(mimeType, currentType)) return;
              resource?.set('mimeType', mimeType);
            }
          }}
        />
      )}
      <AppResourceDownload
        data={resourceData?.data ?? ''}
        resource={resource}
      />
    </div>
  );

  const lastData = React.useRef<string | (() => string | null) | null>(
    resourceData?.data ?? null
  );
  const [possiblyChanged, setPossiblyChanged] = React.useState(false);

  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const handleChangeTab = React.useCallback((index: number) => {
    setTabIndex(index);
    syncData();
  }, []);

  return typeof resourceData === 'object'
    ? children({
        headerString: formatted,
        headerJsx: (
          <div className="flex items-center justify-center gap-2">
            <div className="hidden md:block">
              {appResourceIcon(getResourceType(resource))}
            </div>
            <div className="flex max-w-[90%] gap-1">
              <h3 className="overflow-auto whitespace-nowrap text-2xl">
                {formatted}
              </h3>
              <AppResourceEditButton title={title}>
                {form()}
              </AppResourceEditButton>
            </div>
            <AppTitle title={formatted} />
          </div>
        ),
        headerButtons: headerButtons,
        form: (
          <Form
            className="max-h-[90%] min-h-[30vh] flex-1 overflow-auto"
            forwardRef={setForm}
          >
            <ReadOnlyContext.Provider value={isReadOnly}>
              <AppResourcesTabs
                appResource={appResource}
                data={resourceData.data}
                directory={directory}
                headerButtons={headerButtons}
                index={[tabIndex, handleChangeTab]}
                isFullScreen={[isFullScreen, handleChangeFullScreen]}
                label={formatted}
                resource={resource}
                showValidationRef={showValidationRef}
                onChange={(data): void => {
                  lastData.current = data;
                  setPossiblyChanged(typeof data === 'function');
                  if (typeof data !== 'function')
                    setResourceData({ ...resourceData, data });
                }}
              />
            </ReadOnlyContext.Provider>
          </Form>
        ),
        footer: (
          <>
            {!appResource.isNew() &&
            hasToolPermission('resources', 'delete') &&
            typeof handleDeleted === 'function' ? (
              <DeleteButton resource={appResource} onDeleted={handleDeleted} />
            ) : undefined}
            <span className="-ml-2 flex-1" />
            {formElement !== null &&
            hasToolPermission(
              'resources',
              appResource.isNew() ? 'create' : 'update'
            ) ? (
              <SaveButton
                form={formElement}
                resource={appResource}
                saveRequired={isChanged || possiblyChanged}
                onAdd={
                  hasToolPermission('resources', 'create') &&
                  typeof handleClone === 'function'
                    ? (newResource): void => {
                        const resource = serializeResource(newResource);
                        const isClone =
                          typeof resource.spAppResourceDir === 'string';
                        handleClone(
                          {
                            ...resource,
                            name:
                              resource.name.length > 0
                                ? getUniqueName(resource.name, [resource.name])
                                : formsText.newResourceTitle({
                                    tableName: appResource.specifyTable.label,
                                  }),
                          },
                          isClone ? resourceData.id : undefined
                        );
                      }
                    : undefined
                }
                onIgnored={(): void => {
                  showValidationRef.current?.();
                }}
                onSaving={(unsetUnloadProtect): false => {
                  loading(
                    (typeof directory.id === 'number'
                      ? Promise.resolve(directory)
                      : createResource('SpAppResourceDir', directory)
                    ).then(async (resourceDirectory) => {
                      unsetUnloadProtect();

                      if (appResource.isNew())
                        appResource.set(
                          'spAppResourceDir',
                          resourceDirectory.resource_uri
                        );
                      await appResource.save();
                      const resource = serializeResource(appResource);

                      const data =
                        typeof lastData.current === 'function'
                          ? lastData.current()
                          : lastData.current;
                      const appResourceData = deserializeResource({
                        ...resourceData,
                        data,
                        spAppResource:
                          toTable(appResource, 'SpAppResource')?.get(
                            'resource_uri'
                          ) ?? null,
                        spViewSetObj:
                          toTable(appResource, 'SpViewSetObj')?.get(
                            'resource_uri'
                          ) ?? null,
                      });
                      await appResourceData.save();

                      setResourceData(
                        serializeResource(
                          appResourceData
                        ) as SerializedResource<SpAppResourceData>
                      );

                      handleSaved(resource, resourceDirectory);
                    })
                  );

                  return false;
                }}
              />
            ) : undefined}
          </>
        ),
      })
    : null;
}
