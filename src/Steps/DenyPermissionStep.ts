import { each, includes } from 'lodash';

import Step from './Step';
import { Roles } from '../types';

export default class DenyPermissionStep extends Step {
  for(...stages: string[]): void {
    if (!this.parent.hasRoles(this)) {
      console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return;
    }

    const roles: Roles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      console.error(`AccessControl Error: Cannot deny permissions for ${this.query.role} role because it could not be found in grants`);
      return;
    }

    if (!roles[this.query.role!][this.query.permission!]) {
      console.error(`AccessControl Error: Cannot deny ${this.query.permission} permission because it does not exist in ${this.query.role} role`);
      return;
    }

    each(stages, (stage: string) => {
      roles[this.query.role!][this.query.permission!][stage] = false;
    });

    this.parent.modifyRoles(roles, this);
  }
}
