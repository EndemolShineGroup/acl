import debug from 'debug';

import { GrantQuery, Roles } from '../types';
import Step from './Step';

const log = debug('acl:permission-check');

export default class PermissionCheckStep extends Step {
  hasPermission(): boolean {
    try {
      this.checkRolesExist();
    } catch (error) {
      return false;
    }

    const roles: Roles = this.rolesStore.getRoles();

    const query = this.query as GrantQuery;

    for (let i: number = 0; i < query.roles.length; i++) {
      const roleName = query.roles[i];
      const role = roles[roleName];

      if (!role) {
        log(
          `AccessControl Error: ${roleName} role could not be found in grants`,
        );
        return false;
      }

      for (let j: number = 0; j < query.permissions.length; j++) {
        if (!role[query.permissions[j]]) {
          if (!query.any) {
            log(
              `AccessControl Error: ${
                query.permissions[j]
              } permission could not be found for ${roleName} role`,
            );
            return false;
          }

          continue;
        }

        const permission = role[query.permissions[j]];

        for (let k: number = 0; k < query.environments.length; k++) {
          if (!permission[query.environments[k]]) {
            if (!query.any) {
              return false;
            }

            continue;
          }

          return true;
        }
      }
    }

    return !query.any;
  }
}
