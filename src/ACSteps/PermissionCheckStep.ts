import { ACStep } from './';
import { ACGrantsObject, Stage, GrantQuery } from '../types';

export default class PermissionCheckStep extends ACStep {
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
