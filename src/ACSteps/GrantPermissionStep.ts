import { ACStep } from './';
import { Stage } from '../types';

import { each, includes } from 'lodash';

export default class GrantPermissionStep extends ACStep {
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
