import { ACStep } from './';
import { ACGrantsObject } from '../types';

import { isEqual, each, includes } from 'lodash';

export default class AllowStep extends ACStep {
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
