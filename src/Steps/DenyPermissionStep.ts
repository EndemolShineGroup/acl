import each from 'lodash.foreach';

import PermissionNotFoundError from '../Errors/PermissionNotFoundError';
import RoleNotFoundError from '../Errors/RoleNotFoundError';
import { Roles } from '../types';
import Step from './Step';

export default class DenyPermissionStep extends Step {
  for(...stages: string[]): void {
    this.checkRolesExist();

    const roles: Roles = this.parent.getRoles(this);

    if (!roles[this.query.role!]) {
      throw new RoleNotFoundError(this.query.role!);
    }

    if (!roles[this.query.role!][this.query.permission!]) {
      throw new PermissionNotFoundError(
        this.query.role!,
        this.query.permission!,
        'deny',
      );
    }

    each(stages, (stage: string) => {
      roles[this.query.role!][this.query.permission!][stage] = false;
    });

    this.parent.modifyRoles(roles, this);
  }
}
