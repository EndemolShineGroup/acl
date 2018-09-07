import { ACStep } from './';
import { Stage } from '../types';

import { each, includes } from 'lodash';

export default class DenyPermissionStep extends ACStep {
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
