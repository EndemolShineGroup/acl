import debug from 'debug';

import { GrantQuery, Roles } from '../types';
import Step from './Step';

const log = debug('acl:permission-check');

export default class PermissionCheckStep extends Step {
  hasPermission(): boolean {
    try {
      this.checkRolesExist();
    } catch (error) {
      if (error.message.includes('AccessControl setup incorrectly')) {
        return false;
      }
    }

    const roles: Roles = this.parent.getRoles(this);

    const query = this.query as GrantQuery;

    if (!roles[query.role]) {
      log(
        `AccessControl Error: ${query.role} role could not be found in grants`,
      );
      return false;
    }

    if (!roles[query.role][query.permission]) {
      log(
        `AccessControl Error: ${
          query.permission
        } permission could not be found for ${query.role} role`,
      );
      return false;
    }

    return roles[query.role][query.permission][query.environment];
  }
}
