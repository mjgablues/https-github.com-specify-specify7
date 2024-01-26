import React from 'react';
import { useParams } from 'react-router-dom';

import { useBooleanState } from '../../hooks/useBooleanState';
import { commonText } from '../../localization/common';
import { interactionsText } from '../../localization/interactions';
import type { RA, RR } from '../../utils/types';
import { Ul } from '../Atoms';
import { DataEntry } from '../Atoms/DataEntry';
import { icons } from '../Atoms/Icons';
import { Link } from '../Atoms/Link';
import { EditFormTables } from '../DataEntryTables/Edit';
import { useDataEntryTables } from '../DataEntryTables/fetchTables';
import { getResourceViewUrl } from '../DataModel/resource';
import type { SpecifyTable } from '../DataModel/specifyTable';
import { getTable, tables } from '../DataModel/tables';
import type { Tables } from '../DataModel/types';
import { Dialog, dialogClassNames } from '../Molecules/Dialog';
import { TableIcon } from '../Molecules/TableIcon';
import { hasTablePermission } from '../Permissions/helpers';
import { ProtectedTable } from '../Permissions/PermissionDenied';
import { Redirect } from '../Router/Redirect';
import { OverlayContext } from '../Router/Router';
import { fetchLegacyInteractions } from './fetch';
import { InteractionDialog } from './InteractionDialog';

export const interactionWorkflowTables: Partial<
  RR<keyof Tables, 'CollectionObject' | 'Preparation'>
> = {
  /*
   * Accession: 'CollectionObject',
   * Appraisal: 'CollectionObject',
   */
  Loan: 'CollectionObject',
  Gift: 'CollectionObject',
  Disposal: 'CollectionObject',
  /*
   * ExchangeOut: 'Preparation',
   * InfoRequest: 'CollectionObject',
   */
};

export function InteractionsOverlay(): JSX.Element | null {
  const tables = useDataEntryTables('interactions');
  const handleClose = React.useContext(OverlayContext);

  return typeof tables === 'object' ? (
    <Interactions entries={tables} onClose={handleClose} />
  ) : null;
}

function Interactions({
  onClose: handleClose,
  entries,
}: {
  readonly onClose: () => void;
  readonly entries: RA<SpecifyTable>;
}): JSX.Element {
  const [isEditing, handleEditing] = useBooleanState();
  return isEditing ? (
    <EditFormTables type="interactions" onClose={handleClose} />
  ) : (
    <Dialog
      buttons={commonText.cancel()}
      className={{
        container: dialogClassNames.narrowContainer,
      }}
      header={interactionsText.interactions()}
      headerButtons={<DataEntry.Edit onClick={handleEditing} />}
      icon={<span className="text-blue-500">{icons.chat}</span>}
      onClose={handleClose}
    >
      <Ul>
        {entries
          .filter((table) => hasTablePermission(table.name, 'create'))
          .map((table, index) => (
            <li key={index}>
              <Link.Default
                href={
                  table.name === 'LoanReturnPreparation'
                    ? `/specify/overlay/interactions/return-loan/`
                    : table.name in interactionWorkflowTables
                    ? `/specify/overlay/interactions/create/${table.name}/`
                    : getResourceViewUrl(table.name)
                }
              >
                <TableIcon label={false} name={table.name} />
                {table.name === 'LoanReturnPreparation'
                  ? interactionsText.returnLoan({
                      tableLoan: tables.Loan.label,
                    })
                  : table.label}
              </Link.Default>
            </li>
          ))}
      </Ul>
    </Dialog>
  );
}

export function InteractionAction(): JSX.Element | null {
  const handleClose = React.useContext(OverlayContext);
  const { tableName = '' } = useParams();
  const rawTable = React.useMemo(() => getTable(tableName), [tableName]);
  const table =
    typeof rawTable === 'object' && rawTable.name in interactionWorkflowTables
      ? rawTable
      : undefined;
  return table === undefined ? (
    <Redirect to="/specify/overlay/interactions/" />
  ) : (
    <ProtectedTable action="create" tableName={table.name}>
      <InteractionDialog actionTable={table} onClose={handleClose} />
    </ProtectedTable>
  );
}

export function InteractionLoanReturn(): JSX.Element {
  const handleClose = React.useContext(OverlayContext);
  return (
    <InteractionDialog
      actionTable={tables.Loan}
      isLoanReturn
      onClose={handleClose}
    />
  );
}

export const exportsForTests = {
  fetchEntries: fetchLegacyInteractions,
};
