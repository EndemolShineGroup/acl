import uniq from 'lodash.uniq';

import RolesStore from '../RolesStore';
import { Grants } from '../types';

export default function EnvsResolver(
  rolesStore: RolesStore,
  roles: string[],
  permissions: string[],
  ...envs: string[]
): string[] {
  if (envs.length === 1 && envs[0] === '*') {
    envs = [];

    roles.forEach((role: string) => {
      Object.keys(rolesStore.getPermissions(role)!).forEach((key: string) => {
        envs = envs.concat(Object.keys(rolesStore.getPermissions(role)![key]));
      });
    });
  }

  return uniq(envs);
}
