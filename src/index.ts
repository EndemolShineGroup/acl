import { cloneDeep, omit, isEmpty, map } from 'lodash';

// ACSteps
import {
  DoesAnyStep,
  PermissionCheckStep,
  HaveStep,
  DoesStep,
  AllowStep,
  GrantPermissionStep,
  GrantStep,
  DenyPermissionStep,
  DenyStep,
  ACStep,
} from './ACSteps';


// Types
import { ACRoles, GrantQuery, ACPermissions } from './types';

export default class AccessControl {

  /* Obs: Maybe we can remove it, it's currently here just to keep a reference to original roles passed by the use
    I've left there because I thought in the future we could have a reset functionality */
  private roles: ACRoles = {};

  private modifiedRoles: ACRoles = {};

  constructor(roles?: ACRoles) {
    if (roles) {
      this.roles         = roles;
      this.modifiedRoles = roles;
    }
  }

  getRoles(internal: ACStep | null = null): ACRoles {
    if (!this.hasRoles(this) && !internal) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return {};
    }

    return cloneDeep(this.modifiedRoles);
  }

  getRolesList(): string[] {
    return Object.keys(this.modifiedRoles);
  }

  getPermissions(role: string): ACPermissions | null {
    if (isEmpty(this.modifiedRoles[role])) {
      console.error(`AccessControl Error: ${role} role does not exist. Can't get permissions`);
      return null
    }

    return this.modifiedRoles[role];
  }

  setRoles(grants: ACRoles):void {
    this.roles         = grants;
    this.modifiedRoles = grants;
  }

  // Steps
  does(role: string):DoesStep {
    return new DoesStep({role}, this);
  }

  doesAny(roles: string[]):DoesAnyStep {
    return new DoesAnyStep({role: '', roles}, this);
  }

  allow(role: string):AllowStep {
    return new AllowStep({role}, this);
  }

  grant(role: string):GrantStep {
    return new GrantStep({role}, this);
  }

  deny(role: string):DenyStep {
    return new DenyStep({role}, this);
  }

  remove(role: string):void {
    if (!this.hasRoles(this)) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return;
    }

    this.modifiedRoles = omit(this.modifiedRoles, [role]);
  }

  // Internal methods
  modifyRoles(roles: ACRoles, internal: ACStep):void {
    this.modifiedRoles = roles;
  }

  hasRoles(internal: ACStep | AccessControl): boolean {
    return !isEmpty(this.modifiedRoles);
  }
}
