import debug from 'debug';

import { GrantQuery, Grants, Permissions, Roles } from '../types';
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
      const role: Permissions = roles[roleName];

      if (!role) {
        log(
          `AccessControl Error: ${roleName} role could not be found in grants`,
        );
        return false;
      }

      const permissionsOutcome = this.matchPermissions(role, query, roleName);
      if (permissionsOutcome !== null) {
        return permissionsOutcome;
      }
    }

    return !query.any;
  }

  matchPermissions = (
    role: Permissions,
    query: GrantQuery,
    roleName: string,
  ) => {
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

      const rolesOutcome = this.matchRoles(
        role[query.permissions[j]],
        query.environments,
        query.any,
      );

      if (rolesOutcome !== null) {
        return rolesOutcome;
      }
    }

    return null;
  };

  matchRoles = (permission: Grants, envs: string[], any?: boolean) => {
    for (let i: number = 0; i < envs.length; i++) {
      if (!permission[envs[i]]) {
        if (!any) {
          return false;
        }

        continue;
      }

      if (permission[envs[i]] && any) {
        return true;
      }
    }

    return null;
  };
}
