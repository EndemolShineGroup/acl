import AccessControlError from '../Errors/AccessControlError';
import RolesStore from '../RolesStore';
import { GrantQuery } from '../types';

export default class Step {
  constructor(
    protected query: Partial<GrantQuery>,
    protected rolesStore: RolesStore,
  ) {}

  checkRolesExist() {
    if (!this.rolesStore.hasRoles()) {
      throw new AccessControlError();
    }
  }
}
