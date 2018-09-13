import { cloneDeep, isEmpty, omit } from 'lodash';

import AccessControlError from './Errors/AccessControlError';
import AllowStep from './Steps/AllowStep';
import DenyStep from './Steps/DenyStep';
import DoesAnyStep from './Steps/DoesAnyStep';
import DoesStep from './Steps/DoesStep';
import GrantStep from './Steps/GrantStep';
import Step from './Steps/Step';
import { Permissions, Roles } from './types';

export default class AccessControl {
  /* Obs: Maybe we can remove it, it's currently here just to keep a reference to original roles passed by the use
    I've left there because I thought in the future we could have a reset functionality */
  // tslint:disable-next-line:no-unused-variable
  private roles: Roles = {};

  private modifiedRoles: Roles = {};

  constructor(roles?: Roles) {
    if (roles) {
      this.roles = roles;
      this.modifiedRoles = roles;
    }
  }

  getRoles(internal: Step | null = null): Roles {
    if (!this.hasRoles(this) && !internal) {
      throw new AccessControlError(
        `AccessControl setup incorrectly. Please set grants before using it`,
      );
    }

    return cloneDeep(this.modifiedRoles);
  }

  getRolesList(): string[] {
    return Object.keys(this.modifiedRoles);
  }

  getPermissions(role: string): Permissions | null {
    if (isEmpty(this.modifiedRoles[role])) {
      throw new AccessControlError(
        `${role} role does not exist. Can't get permissions`,
      );
    }

    return this.modifiedRoles[role];
  }

  setRoles(grants: Roles): void {
    this.roles = grants;
    this.modifiedRoles = grants;
  }

  // Steps
  does(role: string): DoesStep {
    return new DoesStep({ role }, this);
  }

  doesAny(roles: string[]): DoesAnyStep {
    return new DoesAnyStep({ role: '', roles }, this);
  }

  allow(role: string): AllowStep {
    return new AllowStep({ role }, this);
  }

  grant(role: string): GrantStep {
    return new GrantStep({ role }, this);
  }

  deny(role: string): DenyStep {
    return new DenyStep({ role }, this);
  }

  remove(role: string): void {
    if (!this.hasRoles(this)) {
      throw new AccessControlError(
        `AccessControl setup incorrectly. Please set grants before using it`,
      );
    }

    this.modifiedRoles = omit(this.modifiedRoles, [role]);
  }

  // Internal methods
  modifyRoles(roles: Roles, internal: Step): void {
    this.modifiedRoles = roles;
  }

  hasRoles(internal: Step | AccessControl): boolean {
    return !isEmpty(this.modifiedRoles);
  }
}
