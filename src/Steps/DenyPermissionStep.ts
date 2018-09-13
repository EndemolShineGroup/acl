import { each } from 'lodash';

import AccessControlError from '../Errors/AccessControlError';
import { Roles } from '../types';
import Step from './Step';

export default class DenyPermissionStep extends Step {
  for(...stages: string[]): void {
    if (!this.parent.hasRoles(this)) {
      throw new AccessControlError(`AccessControl setup incorrectly. Please set grants before using it`)
    }

    const roles: Roles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      throw new AccessControlError(`Cannot deny permissions for ${this.query.role} role because it could not be found in grants`);
    }

    if (!roles[this.query.role!][this.query.permission!]) {
      throw new AccessControlError(`Cannot deny ${this.query.permission} permission because it does not exist in ${this.query.role} role`);
    }

    each(stages, (stage: string) => {
      roles[this.query.role!][this.query.permission!][stage] = false;
    });

    this.parent.modifyRoles(roles, this);
  }
}
