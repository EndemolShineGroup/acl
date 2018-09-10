import { ACStep } from './';
import { ACRoles } from '../types';

import { each, includes } from 'lodash';

export default class GrantPermissionStep extends ACStep {
  for(...stages: string[]): void {
    const roles: ACRoles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      roles[this.query.role!] = {};
    }

    if (!roles[this.query.role!][this.query.permission!]) {
      roles[this.query.role!][this.query.permission!] = {
        dev: false,
        staging: false,
        prod: false,
      };
    }

    each(stages, (stage: string) => {
      roles[this.query.role!][this.query.permission!][stage] = true;
    });

    this.parent.modifyRoles(roles, this);
  }
}
