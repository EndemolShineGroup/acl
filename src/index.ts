import { cloneDeep, omit, isEmpty } from 'lodash';

// ACSteps
import {
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
import { Stage, ACGrantsObject, GrantQuery } from './types';

export default class AccessControl {

  private grants: ACGrantsObject;

  private assumedGrants: ACGrantsObject;

  private modifiedGrants: ACGrantsObject;

  constructor(grants?: ACGrantsObject) {
    if (grants) {
      this.grants         = grants;
      this.assumedGrants  = grants;
      this.modifiedGrants = grants;
    }
  }

  getGrants(internal: ACStep | null = null): ACGrantsObject {
    if (!this.grants) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return {};
    }

    // If it's an internal call done by a step we want assumedGrants,
    // if the user calls it we send back modifiedGrants
    if (internal)
      return cloneDeep(this.assumedGrants);
    else
      return cloneDeep(this.modifiedGrants);
  }

  setGrants(grants: ACGrantsObject):void {
    this.grants         = grants;
    this.assumedGrants  = grants;
    this.modifiedGrants = grants;
  }

  // Steps
  does(role: string):DoesStep {
    return new DoesStep({role}, this);
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
    if (!this.grants) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return;
    }

    if (!this.assumedGrants[role]) {
      console.error(`AccessControl Error: ${role} role does not exist in grants and cannot be removed.`);
      return;
    }

    this.assumedGrants  = omit(this.assumedGrants, [role]);
    this.modifiedGrants = omit(this.modifiedGrants, [role]);
  }

  // Internal methods
  assumeGrants(grants: ACGrantsObject, internal: ACStep):void {
    this.assumedGrants  = grants;
  }

  modifyGrants(grants: ACGrantsObject, internal: ACStep):void {
    this.modifiedGrants = grants;
    this.assumeGrants(grants, internal);
  }

  hasGrants(internal: ACStep): boolean {
    return isEmpty(this.grants);
  }
}
