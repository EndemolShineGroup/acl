import AccessControl from '../AccessControl';
import AccessControlError from '../Errors/AccessControlError';
import { GrantQuery } from '../types';

export default class Step {
  constructor(
    protected query: Partial<GrantQuery>,
    protected parent: AccessControl,
  ) {}

  checkRolesExist() {
    if (!this.parent.hasRoles()) {
      throw new AccessControlError();
    }
  }
}
