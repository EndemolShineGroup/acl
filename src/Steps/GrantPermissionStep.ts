import { each } from 'lodash';

import { Roles } from '../types';
import Step from './Step';

export default class GrantPermissionStep extends Step {
  for(...stages: string[]): void {
    const roles: Roles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      roles[this.query.role!] = {};
    }

    if (!roles[this.query.role!][this.query.permission!]) {
      roles[this.query.role!][this.query.permission!] = {
        dev: false,
        prod: false,
        staging: false,
      };
    }

    each(stages, (stage: string) => {
      roles[this.query.role!][this.query.permission!][stage] = true;
    });

    this.parent.modifyRoles(roles, this);
  }
}
