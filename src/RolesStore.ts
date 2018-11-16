import cloneDeep from 'lodash.clonedeep';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';

import PermissionNotFoundError from './Errors/PermissionNotFoundError';

import { Permissions, Roles } from './types';

export default class RolesStore {
  private roles: Roles = {};

  constructor(roles?: Roles) {
    if (roles) {
      this.setRoles(roles);
    }
  }

  setRoles(roles: Roles): void {
    this.roles = roles;
  }

  getRoles(): Roles {
    return cloneDeep(this.roles);
  }

  getRolesList(): string[] {
    return Object.keys(this.roles);
  }

  getPermissions(role: string): Permissions | null {
    if (isEmpty(this.roles[role])) {
      throw new PermissionNotFoundError(role);
    }

    return this.roles[role];
  }

  modifyRoles(roles: Roles): void {
    this.roles = roles;
  }

  hasRoles(): boolean {
    return !isEmpty(this.roles);
  }

  removeRoles(roles: string[]) {
    this.modifyRoles(omit(this.getRoles(), roles));
  }
}
