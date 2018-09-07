import { cloneDeep, isEqual, each, includes, omit, isEmpty } from 'lodash';

export enum Stage { 'dev', 'staging', 'prod' }

export interface ACGrantsObject {
  [key: string] : {
    [key: string] : {
      dev: boolean,
      staging: boolean,
      prod: boolean,
    }
  }
}

interface GrantQuery {
  role: string;
  permission: string;
  environment: Stage;
}

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
      return;
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

class ACStep {

  query: Partial<GrantQuery>;

  parent: AccessControl;

  constructor(query: Partial<GrantQuery>, parent: AccessControl) {
    this.query = query;
    this.parent = parent;
  }
}

// Step classes

class DenyStep extends ACStep {
  permission(permissionName: string): DenyPermissionStep {
    return new DenyPermissionStep({...this.query, permission: permissionName}, this.parent);
  }
}

class DenyPermissionStep extends ACStep {
  for(...stages: Stage[]): void {
    if (this.parent.hasGrants(this)) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return;
    }

    const grants = this.parent.getGrants();

    if (!grants[this.query.role!]) {
      console.error(`AccessControl Error: Cannot deny permissions for ${this.query.role} role because it could not be found in grants`);
      return;
    }

    if (!grants[this.query.role!][this.query.permission!]) {
      console.error(`AccessControl Error: Cannot deny ${this.query.permission} permission because it does not exist in ${this.query.role} role`);
      return;
    }

    each(Object.keys(Stage), (stage, index) => {
      if (includes(stages, Stage[stage])) {
        grants[this.query.role!][this.query.permission!][stage] = false;
      }
    });

    this.parent.modifyGrants(grants, this);
  }
}

class GrantStep extends ACStep {
  permission(permissionName: string): GrantPermissionStep {
    return new GrantPermissionStep({...this.query, permission: permissionName}, this.parent);
  }
}

class GrantPermissionStep extends ACStep {
  for(...stages: Stage[]): void {
    if (this.parent.hasGrants(this)) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return;
    }

    const grants = this.parent.getGrants();

    if (!grants[this.query.role!]) {
      grants[this.query.role!] = {};
    }

    if (!grants[this.query.role!][this.query.permission!]) {
      grants[this.query.role!][this.query.permission!] = {
        dev: false,
        staging: false,
        prod: false,
      };
    }

    each(Object.keys(Stage), (stage, index) => {
      if (includes(stages, Stage[stage])) {
        grants[this.query.role!][this.query.permission!][stage] = true;
      }
    });

    this.parent.modifyGrants(grants, this);
  }
}

class AllowStep extends ACStep {
  toExtend(anotherRole: string):void {
    if (this.parent.hasGrants(this)) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return;
    }

    const grants: ACGrantsObject = this.parent.getGrants();

    if (!grants[this.query.role!]) {
      console.error(`AccessControl Error: Cannot extend ${this.query.role} role because it could not be found in grants`);
      return;
    }

    if (!grants[anotherRole]) {
      console.error(`AccessControl Error: Cannot extend ${anotherRole} role because it could not be found in grants`);
      return;
    }

    const primaryRole = grants[this.query.role!];
    const secondaryRole = grants[anotherRole];

    each(primaryRole, (environmentsObj, permission) => {
      if (isEqual(primaryRole[permission], secondaryRole[permission])) {
        return;
      }

      each(environmentsObj, (bool, environment) => {
        // If it's already true there's no need to set to the same value
        if (primaryRole[permission][environment]) {
          return;
        }

        primaryRole[permission][environment] = secondaryRole[permission][environment];
      });
    });

    this.parent.assumeGrants(grants, this);
  }
}

class DoesStep extends ACStep {
  havePermission(permission: string):HaveStep {
    return new HaveStep({...this.query, permission}, this.parent);
  }
}

class HaveStep extends ACStep{
  for(environment: Stage):boolean {
    return new PermissionCheckStep({...this.query, environment}, this.parent).hasPermission();
  }
}

class PermissionCheckStep extends ACStep {
  hasPermission():boolean {
    if (this.parent.hasGrants(this)) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return false;
    }

    const grants: ACGrantsObject = this.parent.getGrants(this);

    const query = this.query as GrantQuery;

    if (!grants[query.role]) {
      console.error(`AccessControl Error: ${query.role} role could not be found in grants`);
      return false;
    }

    if (!grants[query.role][query.permission]) {
      console.error(`AccessControl Error: ${query.permission} permission could not be found for ${query.role} role`);
      return false;
    }

    return grants[query.role][query.permission][Stage[query.environment]];
  }
}
