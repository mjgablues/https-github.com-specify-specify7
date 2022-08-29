import React from 'react';

import { useAsyncState } from '../../hooks/useAsyncState';
import { useBooleanState } from '../../hooks/useBooleanState';
import { commonText } from '../../localization/common';
import { welcomeText } from '../../localization/welcome';
import { ajax } from '../../utils/ajax';
import { Http } from '../../utils/ajax/helpers';
import { H3 } from '../Atoms';
import { Button } from '../Atoms/Button';
import { Link } from '../Atoms/Link';
import { fetchCollection } from '../DataModel/collection';
import { schema } from '../DataModel/schema';
import { supportLink } from '../Errors/ErrorDialog';
import { getSystemInfo } from '../InitialContext/systemInfo';
import { DateElement } from '../Molecules/DateElement';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { hasTablePermission } from '../Permissions/helpers';
import { OverlayContext } from '../Router/Router';

export function AboutOverlay(): JSX.Element {
  const handleClose = React.useContext(OverlayContext);
  return <AboutDialog isOpen onClose={handleClose} />;
}

export function AboutSpecify(): JSX.Element {
  const [isOpen, handleOpen, handleClose] = useBooleanState();
  return (
    <div className="flex-1 text-right">
      <Button.LikeLink title={welcomeText('aboutSpecify')} onClick={handleOpen}>
        <img
          alt={welcomeText('aboutSpecify')}
          src="/static/img/specify_7_small.png"
        />
      </Button.LikeLink>
      <AboutDialog isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}

function AboutDialog({
  isOpen,
  onClose: handleClose,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}): JSX.Element {
  return (
    <Dialog
      buttons={commonText('close')}
      className={{
        container: `${dialogClassNames.normalContainer} w-[min(30rem,90%)]`,
        content: `${dialogClassNames.flexContent} pr-4`,
        header: 'text-3xl',
      }}
      header={welcomeText('aboutSpecify')}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <p>
        <b>{welcomeText('fullAddress')}</b>
      </p>
      <address>
        <p>
          <Link.NewTab href="https://specifysoftware.org" rel="noreferrer">
            www.specifysoftware.org
          </Link.NewTab>
        </p>
        <p>{supportLink}</p>
      </address>
      <p className="text-justify">{welcomeText('disclosure')}</p>
      <p className="text-justify">{welcomeText('licence')}</p>

      <section>
        <H3>{welcomeText('systemInformation')}</H3>
        <table className="grid-table grid-cols-[auto,auto] gap-1">
          <tbody>
            {[
              [welcomeText('specifyVersion'), getSystemInfo().version],
              [welcomeText('gitSha'), <GitSha />],
              [welcomeText('buildDate'), <BuildDate />],
              [
                welcomeText('specifySixVersion'),
                getSystemInfo().specify6_version,
              ],
              [
                welcomeText('databaseVersion'),
                getSystemInfo().database_version,
              ],
              [
                welcomeText('schemaVersion'),
                <Link.Default href="/specify/datamodel/" key="link">
                  {getSystemInfo().schema_version}
                </Link.Default>,
              ],
              [welcomeText('databaseName'), getSystemInfo().database],
              ...(hasTablePermission('SpVersion', 'read')
                ? [
                    [
                      welcomeText('databaseCreationDate'),
                      <DatabaseCreationDate key="" />,
                    ],
                  ]
                : []),
              [
                `${schema.models.Institution.label}:`,
                getSystemInfo().institution,
              ],
              [
                `${schema.models.Discipline.label}:`,
                getSystemInfo().discipline,
              ],
              [
                `${schema.models.Collection.label}: `,
                getSystemInfo().collection,
              ],
              [
                welcomeText('isaNumber'),
                getSystemInfo().isa_number ?? commonText('notApplicable'),
              ],
              [welcomeText('browser'), globalThis.navigator.userAgent],
            ].map(([label, value], index) => (
              <tr key={index}>
                <th className="justify-end whitespace-nowrap" scope="row">
                  {label}
                </th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Dialog>
  );
}

function DatabaseCreationDate(): JSX.Element {
  const [date] = useAsyncState(
    React.useCallback(
      async () =>
        fetchCollection('SpVersion', { limit: 1 }).then(
          ({ records }) => records[0]?.timestampCreated
        ),
      []
    ),
    false
  );
  return <DateElement date={date} fallback={commonText('loading')} flipDates />;
}

function GitSha(): JSX.Element {
  const [gitSha] = useAsyncState(
    React.useCallback(
      async () =>
        ajax(
          '/static/git_sha.txt',
          {
            headers: {
              accept: 'text/plain',
            },
          },
          {
            expectedResponseCodes: [Http.OK, Http.NOT_FOUND],
          }
        ).then(({ data, status }) =>
          status === Http.NOT_FOUND ? false : data
        ),
      []
    ),
    false
  );
  return (
    <>
      {gitSha === false ? (
        commonText('unknown')
      ) : typeof gitSha === 'string' ? (
        <Link.NewTab
          className="break-all"
          href={`https://github.com/specify/specify7/commit/${gitSha}`}
        >
          {gitSha}
        </Link.NewTab>
      ) : (
        commonText('loading')
      )}
    </>
  );
}

function BuildDate(): JSX.Element {
  const [buildDate] = useAsyncState(
    React.useCallback(
      async () =>
        ajax(
          '/static/build_date.txt',
          {
            headers: {
              accept: 'text/plain',
            },
          },
          {
            expectedResponseCodes: [Http.OK, Http.NOT_FOUND],
          }
        ).then(({ data, status }) =>
          status === Http.NOT_FOUND ? welcomeText('unknown') : data
        ),
      []
    ),
    false
  );
  return <DateElement date={buildDate} fallback={commonText('loading')} />;
}
