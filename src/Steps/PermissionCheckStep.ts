import debug from 'debug';

import { GrantQuery, Permissions } from '../types';
import Step from './Step';

const log = debug('acl:permission-check');

export default class PermissionCheckStep extends Step {
  roleHasPermissionInEnvironment = (
    rolesPermissions: Permissions,
    permission: string,
    environment: string,
    roleName: string,
  ) => {
    if (!rolesPermissions[permission]) {
      log(
        `AccessControl Error: ${permission} permission could not be found for ${roleName} role`,
      );
    }
    return (
      rolesPermissions[permission] && rolesPermissions[permission][environment]
    );
  };

  roleHasPermissionInEveryEnvironment = (
    rolesPermissions: Permissions,
    permission: string,
    environments: string[],
    roleName: string,
  ) => {
    const filter = this.query.any ? 'some' : 'every';
    return environments[filter]((environment) => {
      return this.roleHasPermissionInEnvironment(
        rolesPermissions,
        permission,
        environment,
        roleName,
      );
    });
  };

  roleHasEveryPermission = (
    roleName: string,
    permissions: string[],
    environments: string[],
  ): boolean => {
    let rolePermissions = this.rolesStore.getRoles()[roleName];
    if (!rolePermissions) {
      log(`AccessControl Error: ${roleName} role could not be found in grants`);
      return false;
    }

    const filter = this.query.any ? 'some' : 'every';

    return permissions[filter]((permission: string) => {
      return this.roleHasPermissionInEveryEnvironment(
        rolePermissions,
        permission,
        environments,
        roleName,
      );
    });
  }

  hasPermission(): boolean {
    try {
      this.checkRolesExist();
    } catch (error) {
      return false;
    }

    const query = this.query as GrantQuery;
    const filter = query.any ? 'some' : 'every';
    return query.roles[filter]((role) => {
      return this.roleHasEveryPermission(
        role,
        query.permissions,
        query.environments,
      );
    });
  }
}
