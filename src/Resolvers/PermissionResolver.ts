import RolesStore from '../RolesStore';

import uniq from 'lodash.uniq';

export default function PermissionResolver(
  rolesStore: RolesStore,
  roles: string[],
  ...permissions: string[]
): string[] {
  if (permissions.length === 1 && permissions[0] === '*') {
    permissions = [];

    roles.forEach((role: string) => {
      permissions.concat(Object.keys(rolesStore.getPermissions(role)!));
    });
  }

  return uniq(permissions);
}
