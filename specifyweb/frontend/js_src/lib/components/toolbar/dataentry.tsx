import React from 'react';

import { commonText } from '../../localization/common';
import { getTablePermissions } from '../../permissions';
import { getUserPref } from '../../preferencesutils';
import { schema } from '../../schema';
import { FormsDialog } from '../formsdialog';
import { icons } from '../icons';
import type { MenuItem } from '../main';

export const menuItem: MenuItem = {
  task: 'data',
  title: commonText('dataEntry'),
  icon: icons.pencilAt,
  isOverlay: true,
  enabled: () =>
    getUserPref('header', 'menu', 'showDataEntry') &&
    // Show DataEntry only if has "create" permission to at least one table
    Object.values(getTablePermissions()[schema.domainLevelIds.collection]).some(
      ({ create }) => create
    ),
  view: ({ onClose: handleClose }) => <FormsDialog onClose={handleClose} />,
};
