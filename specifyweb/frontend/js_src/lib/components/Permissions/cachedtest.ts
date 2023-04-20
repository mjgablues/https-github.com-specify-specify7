import { RA } from '../../utils/types';
import { PermissionsQueryItem } from './index';

export const testPermissionResult: {
  readonly allowed: boolean;
  readonly details: RA<PermissionsQueryItem>;
} = {
  allowed: true,
  details: [
    {
      resource: '/system/sp7/collection',
      action: 'access',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
        {
          collectionid: 4,
          userid: 30,
          resource: '/system/sp7/collection',
          action: 'access',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/admin/user/password',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/admin/user/agents',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/admin/user/sp6/is_admin',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/record/replace',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/record/replace',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/admin/user/invite_link',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/admin/user/oic_providers',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/admin/user/sp6/collection_access',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/admin/user/sp6/collection_access',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/report',
      action: 'execute',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/export/dwca',
      action: 'execute',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/export/feed',
      action: 'force_update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/list_admins',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/policies/user',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/policies/user',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/user/roles',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/user/roles',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/roles',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/roles',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/roles',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/roles',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/roles',
      action: 'copy_from_library',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/library/roles',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/library/roles',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/library/roles',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/permissions/library/roles',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/taxon',
      action: 'merge',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/taxon',
      action: 'move',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/taxon',
      action: 'synonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/taxon',
      action: 'desynonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/taxon',
      action: 'repair',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geography',
      action: 'merge',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geography',
      action: 'move',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geography',
      action: 'synonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geography',
      action: 'desynonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geography',
      action: 'repair',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/storage',
      action: 'merge',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/storage',
      action: 'move',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/storage',
      action: 'synonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/storage',
      action: 'desynonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/storage',
      action: 'repair',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geologictimeperiod',
      action: 'merge',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geologictimeperiod',
      action: 'move',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geologictimeperiod',
      action: 'synonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geologictimeperiod',
      action: 'desynonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/geologictimeperiod',
      action: 'repair',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/lithostrat',
      action: 'merge',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/lithostrat',
      action: 'move',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/lithostrat',
      action: 'synonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/lithostrat',
      action: 'desynonymize',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/tree/edit/lithostrat',
      action: 'repair',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/querybuilder/query',
      action: 'execute',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/querybuilder/query',
      action: 'export_csv',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/querybuilder/query',
      action: 'export_kml',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/querybuilder/query',
      action: 'create_recordset',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'upload',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'unupload',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'validate',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'transfer',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/workbench/dataset',
      action: 'create_recordset',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accession',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accession',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accession',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accession',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionagent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionagent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionagent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionagent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionauthorization',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionauthorization',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionauthorization',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessionauthorization',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessioncitation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessioncitation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessioncitation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/accessioncitation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/address',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/address',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/address',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/address',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/addressofrecord',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/addressofrecord',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/addressofrecord',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/addressofrecord',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentgeography',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentgeography',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentgeography',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentgeography',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentidentifier',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentidentifier',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentidentifier',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentidentifier',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentspecialty',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentspecialty',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentspecialty',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentspecialty',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentvariant',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentvariant',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentvariant',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/agentvariant',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/appraisal',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/appraisal',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/appraisal',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/appraisal',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentimageattribute',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentimageattribute',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentimageattribute',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentimageattribute',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentmetadata',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentmetadata',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentmetadata',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmentmetadata',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmenttag',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmenttag',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmenttag',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attachmenttag',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attributedef',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attributedef',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attributedef',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/attributedef',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/author',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/author',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/author',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/author',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/autonumberingscheme',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/autonumberingscheme',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/autonumberingscheme',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/autonumberingscheme',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrow',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrow',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrow',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrow',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowagent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowagent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowagent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowagent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowmaterial',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowmaterial',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowmaterial',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowmaterial',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowreturnmaterial',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowreturnmaterial',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowreturnmaterial',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/borrowreturnmaterial',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingevent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingevent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingevent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingevent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattr',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattr',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattr',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattr',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattribute',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattribute',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattribute',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventattribute',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventauthorization',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventauthorization',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventauthorization',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingeventauthorization',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtrip',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtrip',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtrip',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtrip',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattribute',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattribute',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattribute',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripattribute',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripauthorization',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripauthorization',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripauthorization',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectingtripauthorization',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collection',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collection',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collection',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collection',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobject',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobject',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobject',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobject',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattr',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattr',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattr',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattr',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattribute',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattribute',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattribute',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectattribute',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectcitation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectcitation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectcitation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectcitation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectproperty',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectproperty',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectproperty',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionobjectproperty',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionreltype',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionreltype',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionreltype',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionreltype',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionrelationship',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionrelationship',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionrelationship',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collectionrelationship',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collector',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collector',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collector',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/collector',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametx',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametx',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametx',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametx',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametxcitation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametxcitation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametxcitation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/commonnametxcitation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescription',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescription',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescription',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescription',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescriptionattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescriptionattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescriptionattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservdescriptionattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservevent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservevent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservevent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conservevent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conserveventattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conserveventattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conserveventattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/conserveventattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/container',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/container',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/container',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/container',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnaprimer',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnaprimer',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnaprimer',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnaprimer',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequence',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequence',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequence',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequence',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequenceattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequenceattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequenceattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequenceattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrun',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrun',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrun',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrun',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrunattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrunattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrunattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingrunattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingruncitation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingruncitation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingruncitation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/dnasequencingruncitation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/datatype',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/datatype',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/datatype',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/datatype',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccession',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccession',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccession',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccession',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionagent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionagent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionagent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionagent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/deaccessionattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determination',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determination',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determination',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determination',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determinationcitation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determinationcitation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determinationcitation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determinationcitation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determiner',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determiner',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determiner',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/determiner',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/discipline',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/discipline',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/discipline',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/discipline',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposal',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposal',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposal',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposal',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalagent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalagent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalagent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalagent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalpreparation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalpreparation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalpreparation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/disposalpreparation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/division',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/division',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/division',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/division',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangein',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangein',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangein',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangein',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinprep',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinprep',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinprep',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeinprep',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeout',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeout',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeout',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeout',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutprep',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutprep',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutprep',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exchangeoutprep',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccata',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccata',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccata',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccata',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccataitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccataitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccataitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/exsiccataitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/extractor',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/extractor',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/extractor',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/extractor',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebook',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebook',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebook',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebook',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpage',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpage',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpage',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpage',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageset',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageset',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageset',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpageset',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpagesetattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpagesetattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpagesetattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fieldnotebookpagesetattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fundingagent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fundingagent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fundingagent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/fundingagent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geocoorddetail',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geocoorddetail',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geocoorddetail',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geocoorddetail',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geography',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geography',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geography',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geography',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedef',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedef',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedef',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedef',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedefitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedefitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedefitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geographytreedefitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiod',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiod',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiod',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiod',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedef',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedef',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedef',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedef',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedefitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedefitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedefitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/geologictimeperiodtreedefitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/gift',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/gift',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/gift',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/gift',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftagent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftagent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftagent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftagent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftpreparation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftpreparation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftpreparation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/giftpreparation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/groupperson',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/groupperson',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/groupperson',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/groupperson',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/inforequest',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/inforequest',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/inforequest',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/inforequest',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institution',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institution',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institution',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institution',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institutionnetwork',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institutionnetwork',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institutionnetwork',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/institutionnetwork',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/journal',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/journal',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/journal',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/journal',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygon',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygon',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygon',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygon',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygonpnt',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygonpnt',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygonpnt',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/latlonpolygonpnt',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrat',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrat',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrat',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrat',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedef',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedef',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedef',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedef',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedefitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedefitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedefitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/lithostrattreedefitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loan',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loan',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loan',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loan',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanagent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanagent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanagent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanagent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanpreparation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanpreparation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanpreparation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanpreparation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanreturnpreparation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanreturnpreparation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanreturnpreparation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/loanreturnpreparation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/locality',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/locality',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/locality',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/locality',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localityattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localityattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localityattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localityattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitycitation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitycitation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitycitation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitycitation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitydetail',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitydetail',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitydetail',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitydetail',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitynamealias',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitynamealias',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitynamealias',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/localitynamealias',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/materialsample',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/materialsample',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/materialsample',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/materialsample',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/morphbankview',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/morphbankview',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/morphbankview',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/morphbankview',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/otheridentifier',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/otheridentifier',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/otheridentifier',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/otheridentifier',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/paleocontext',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/paleocontext',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/paleocontext',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/paleocontext',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/pcrperson',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/pcrperson',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/pcrperson',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/pcrperson',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permit',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permit',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permit',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permit',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permitattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permitattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permitattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/permitattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklist',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklist',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklist',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklist',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklistitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklistitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklistitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/picklistitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preptype',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preptype',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preptype',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preptype',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattr',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattr',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattr',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattr',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattribute',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattribute',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattribute',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationattribute',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationproperty',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationproperty',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationproperty',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/preparationproperty',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/project',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/project',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/project',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/project',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordset',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordset',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordset',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordset',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordsetitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordsetitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordsetitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/recordsetitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referencework',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referencework',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referencework',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referencework',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referenceworkattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referenceworkattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referenceworkattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/referenceworkattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreement',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreement',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreement',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreement',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreementattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreementattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreementattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/repositoryagreementattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/shipment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/shipment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/shipment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/shipment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresource',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresource',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresource',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresource',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedata',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedata',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedata',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedata',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedir',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedir',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedir',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spappresourcedir',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlog',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlog',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlog',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlog',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlogfield',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlogfield',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlogfield',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spauditlogfield',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschema',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschema',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschema',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschema',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitemmapping',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitemmapping',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitemmapping',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemaitemmapping',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemamapping',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemamapping',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemamapping',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spexportschemamapping',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spfieldvaluedefault',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spfieldvaluedefault',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spfieldvaluedefault',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spfieldvaluedefault',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontainer',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontainer',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontainer',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontainer',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontaineritem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontaineritem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontaineritem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocalecontaineritem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocaleitemstr',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocaleitemstr',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocaleitemstr',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/splocaleitemstr',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sppermission',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sppermission',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sppermission',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sppermission',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spprincipal',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spprincipal',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spprincipal',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spprincipal',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spquery',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spquery',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spquery',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spquery',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spqueryfield',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spqueryfield',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spqueryfield',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spqueryfield',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spreport',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spreport',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spreport',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spreport',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spsymbiotainstance',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spsymbiotainstance',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spsymbiotainstance',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spsymbiotainstance',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sptasksemaphore',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sptasksemaphore',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sptasksemaphore',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/sptasksemaphore',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spversion',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spversion',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spversion',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spversion',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spviewsetobj',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spviewsetobj',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spviewsetobj',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spviewsetobj',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spvisualquery',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spvisualquery',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spvisualquery',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/spvisualquery',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/specifyuser',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/specifyuser',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/specifyuser',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/specifyuser',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storage',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storage',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storage',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storage',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storageattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storageattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storageattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storageattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedef',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedef',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedef',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedef',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedefitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedefitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedefitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/storagetreedefitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxon',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxon',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxon',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxon',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattribute',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattribute',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattribute',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxonattribute',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxoncitation',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxoncitation',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxoncitation',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxoncitation',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedef',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedef',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedef',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedef',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedefitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedefitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedefitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/taxontreedefitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmentevent',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmentevent',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmentevent',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmentevent',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmenteventattachment',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmenteventattachment',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmenteventattachment',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/treatmenteventattachment',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/voucherrelationship',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/voucherrelationship',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/voucherrelationship',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/voucherrelationship',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbench',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbench',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbench',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbench',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchdataitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchdataitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchdataitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchdataitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrow',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrow',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrow',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrow',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowexportedrelationship',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowexportedrelationship',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowexportedrelationship',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowexportedrelationship',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowimage',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowimage',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowimage',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchrowimage',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplate',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplate',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplate',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplate',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplatemappingitem',
      action: 'read',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplatemappingitem',
      action: 'create',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplatemappingitem',
      action: 'update',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/table/workbenchtemplatemappingitem',
      action: 'delete',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/preferences/user',
      action: 'edit_protected',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
    {
      resource: '/preferences/statistics',
      action: 'edit_shared',
      allowed: true,
      matching_user_policies: [
        {
          collectionid: 4,
          userid: 30,
          resource: '%',
          action: '%',
        },
      ],
      matching_role_policies: [
        {
          roleid: 2,
          rolename: 'Collection Admin',
          resource: '%',
          action: '%',
        },
      ],
    },
  ],
};
