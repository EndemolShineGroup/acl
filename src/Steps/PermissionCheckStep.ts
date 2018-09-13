import { GrantQuery, Roles } from '../types';
import Step from './Step';

export default class PermissionCheckStep extends Step {
  hasPermission(): boolean {
    if (!this.parent.hasRoles(this)) {
      // console.error(`AccessControl Error: AccessControl setup incorrectly. Please set grants before using it`);
      return false;
    }

    const roles: Roles = this.parent.getRoles(this);

    const query = this.query as GrantQuery;

    if (!roles[query.role]) {
      // console.error(`AccessControl Error: ${query.role} role could not be found in grants`);
      return false;
    }

    if (!roles[query.role][query.permission]) {
      // console.error(`AccessControl Error: ${query.permission} permission could not be found for ${query.role} role`);
      return false;
    }

    return roles[query.role][query.permission][query.environment];
  }
}
