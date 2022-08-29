import React from 'react';

import { useId } from '../../hooks/useId';
import { csrfToken } from '../../utils/ajax/csrftoken';
import type { IR } from '../../utils/types';
import { keysToLowerCase } from '../../utils/utils';
import type { SerializedResource } from '../DataModel/helperTypes';
import type { SpQuery } from '../DataModel/types';

export function RunReport({
  query,
  recordSetId,
  definition,
  parameters,
  onClose: handleClose,
}: {
  readonly query: SerializedResource<SpQuery>;
  readonly recordSetId: number | undefined;
  readonly definition: Document;
  readonly parameters: IR<string>;
  readonly onClose: () => void;
}): JSX.Element {
  const reportWindowContext = useId('report-window')('');
  React.useEffect(
    () => void globalThis.open('', reportWindowContext),
    [reportWindowContext, handleClose]
  );
  const [form, setForm] = React.useState<HTMLFormElement | null>(null);
  React.useEffect(() => {
    if (form === null) return;
    const container = document.createElement('div');
    container.classList.add('hidden');
    document.body.append(container);
    container.innerHTML = form.outerHTML;
    const newForm = container.children[0] as HTMLFormElement;
    newForm.submit();
    globalThis.setTimeout(() => {
      container.remove();
      handleClose();
    }, 0);
  }, [form, handleClose]);
  return (
    <form
      action="/specifyweb/frontend/js_src/lib/components/Reports/index.tsx"
      className="hidden"
      method="post"
      ref={setForm}
      target={reportWindowContext}
    >
      <input
        defaultValue={csrfToken}
        name="csrfmiddlewaretoken"
        type="hidden"
      />
      <input
        defaultValue={new XMLSerializer().serializeToString(
          definition.documentElement
        )}
        name="report"
        type="hidden"
      />
      <input
        defaultValue={JSON.stringify(
          keysToLowerCase({
            ...query,
            limit: 0,
            countOnly: false,
            recordSetId,
          })
        )}
        name="query"
        type="hidden"
      />
      <input
        defaultValue={JSON.stringify(parameters)}
        name="parameters"
        readOnly
        type="hidden"
      />
      <input type="submit" />
    </form>
  );
}
