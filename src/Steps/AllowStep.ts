import debug from 'debug';
import each from 'lodash.foreach';
import isEqual from 'lodash.isequal';

import RoleNotFoundError from '../Errors/RoleNotFoundError';
import { Grants, Permissions, Roles } from '../types';
import Step from './Step';

const log = debug('acl:allow');

export default class AllowStep extends Step {
  toExtend(roleNameToExtend: string): void {
    this.checkRolesExist();

    const roles: Roles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      log(
        `AccessControl Warning: ${
          this.query.role
        } does not exist and will be created`,
      );
      roles[this.query.role!] = {};
    }

    if (!roles[roleNameToExtend]) {
      throw new RoleNotFoundError(roleNameToExtend);
    }

    const primaryRolePermissions: Permissions = roles[this.query.role!];
    const secondaryRolePermissions: Permissions = roles[roleNameToExtend];

    each(secondaryRolePermissions, (grants: Grants, permission: string) => {
      if (
        isEqual(
          primaryRolePermissions[permission],
          secondaryRolePermissions[permission],
        )
      ) {
        return;
      }

      // this is in case we are creating a new role via `allow.toExtend`
      if (!primaryRolePermissions[permission]) {
        primaryRolePermissions[permission] = {
          dev: false,
          prod: false,
          staging: false,
        };
      }

      each(grants, (bool: boolean, grant: string) => {
        // If it's already true there's no need to set to the same value
        if (primaryRolePermissions[permission][grant]) {
          return;
        }

        primaryRolePermissions[permission][grant] =
          secondaryRolePermissions[permission][grant];
      });
    });

    this.parent.modifyRoles(roles, this);
  }
}
