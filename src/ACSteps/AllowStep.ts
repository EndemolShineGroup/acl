import { ACStep } from './';
import { ACRoles, ACPermissions, ACGrants } from '../types';

import { isEqual, each, includes } from 'lodash';

export default class AllowStep extends ACStep {
  toExtend(anotherRole: string):void {
    if (!this.parent.hasRoles(this)) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return;
    }

    const roles: ACRoles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      // console.error(`AccessControl Error: Cannot extend ${this.query.role} role because it could not be found in roles`);
      // return;
      roles[this.query.role!] = {};
    }

    if (!roles[anotherRole]) {
      console.error(`AccessControl Error: Cannot extend ${anotherRole} role because it could not be found in roles`);
      return;
    }

    const primaryRolePermissions:   ACPermissions = roles[this.query.role!];
    const secondaryRolePermissions: ACPermissions = roles[anotherRole];

    each(secondaryRolePermissions, (grants: ACGrants, permission: string) => {
      if (isEqual(primaryRolePermissions[permission], secondaryRolePermissions[permission])) {
        return;
      }

      // this is in case we are creating a new role via `allow.toExtend`
      if (!primaryRolePermissions[permission]) {
        primaryRolePermissions[permission] = {
          dev: false,
          staging: false,
          prod: false,
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
