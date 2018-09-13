import { each, isEqual } from 'lodash';

import AccessControlError from '../Errors/AccessControlError';
import { Grants, Permissions, Roles } from '../types';
import Step from './Step';

export default class AllowStep extends Step {
  toExtend(anotherRole: string):void {
    if (!this.parent.hasRoles(this)) {
      throw new AccessControlError(`AccessControl setup incorrectly. Please set grants before using it`);
    }

    const roles: Roles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      // throw new AccessControlError(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      // console.log(`AccessControl Warning: ${this.query.role} does not exist and will be created`);
      // return;
      roles[this.query.role!] = {};
    }

    if (!roles[anotherRole]) {
      throw new AccessControlError(`Cannot extend ${anotherRole} role because it could not be found in roles`);
    }

    const primaryRolePermissions:   Permissions = roles[this.query.role!];
    const secondaryRolePermissions: Permissions = roles[anotherRole];

    each(secondaryRolePermissions, (grants: Grants, permission: string) => {
      if (isEqual(primaryRolePermissions[permission], secondaryRolePermissions[permission])) {
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

        primaryRolePermissions[permission][grant] = secondaryRolePermissions[permission][grant];
      });
    });

    this.parent.modifyRoles(roles, this);
  }
}
