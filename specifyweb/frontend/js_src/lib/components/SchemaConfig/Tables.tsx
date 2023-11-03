import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { LocalizedString } from 'typesafe-i18n';

import { useCachedState } from '../../hooks/useCachedState';
import { commonText } from '../../localization/common';
import { schemaText } from '../../localization/schema';
import { wbPlanText } from '../../localization/wbPlan';
import { sortFunction } from '../../utils/utils';
import { Ul } from '../Atoms';
import { Button } from '../Atoms/Button';
import { Input, Label } from '../Atoms/Form';
import { Link } from '../Atoms/Link';
import { schema } from '../DataModel/schema';
import { Dialog } from '../Molecules/Dialog';
import { TableIcon } from '../Molecules/TableIcon';
import { formatUrl } from '../Router/queryString';

export function SchemaConfigTables(): JSX.Element {
  const { language = '' } = useParams();
  const navigate = useNavigate();

  const [showHiddenTables = false, setShowHiddenTables] = useCachedState(
    'schemaConfig',
    'showHiddenTables'
  );
  const sortedTables = React.useMemo(() => {
    const sortedTables = Object.values(schema.models).sort(
      sortFunction(({ name }) => name)
    );
    return showHiddenTables
      ? sortedTables
      : sortedTables.filter(({ isSystem }) => !isSystem);
  }, [showHiddenTables]);
  return (
    <Dialog
      buttons={
        <>
          <Link.Green
            download={`schema_localization_${language}.json`}
            href={formatUrl('/context/schema_localization.json', {
              lang: language,
            })}
          >
            {commonText.export()}
          </Link.Green>
          <span className="-ml-2 flex-1" />
          <Button.Secondary
            onClick={(): void => navigate('/specify/schema-config/')}
          >
            {commonText.back()}
          </Button.Secondary>
        </>
      }
      header={schemaText.tables()}
      onClose={(): void => navigate('/specify')}
    >
      <Ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {sortedTables.map((model) => (
          <li className="contents" key={model.tableId}>
            <Link.Default
              href={`/specify/schema-config/${language}/${model.name}/`}
            >
              <TableIcon label={false} name={model.name} />
              {model.name as LocalizedString}
            </Link.Default>
          </li>
        ))}
      </Ul>
      <Label.Inline>
        <Input.Checkbox
          checked={showHiddenTables}
          onValueChange={setShowHiddenTables}
        />
        {wbPlanText.showAdvancedTables()}
      </Label.Inline>
    </Dialog>
  );
}
