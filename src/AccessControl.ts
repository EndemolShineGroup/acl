//Stores
import RolesStore from './RolesStore';
// Errors
import AccessControlError from './Errors/AccessControlError';
// Resolvers
import RolesResolver from './Resolvers/RolesResolver';
// Steps
import AllowStep from './Steps/AllowStep';
import DenyStep from './Steps/DenyStep';
import DoesStep from './Steps/DoesStep';
import GrantStep from './Steps/GrantStep';
// Types
import { Permissions, Roles } from './types';

export default class AccessControl {
  /* Obs: Maybe we can remove it, it's currently here just to keep a reference to original roles passed by the use
    I've left there because I thought in the future we could have a reset functionality */
  // tslint:disable-next-line:no-unused-variable
  private roles: Roles = {};

  private rolesStore: RolesStore;

  constructor(roles?: Roles) {
    if (roles) {
      this.roles = roles;
    }

    this.rolesStore = new RolesStore(roles);
  }

  getRoles(): Roles {
    if (!this.rolesStore.hasRoles()) {
      throw new AccessControlError();
    }

    return this.rolesStore.getRoles();
  }

  getRolesList(): string[] {
    return this.rolesStore.getRolesList();
  }

  getPermissions(role: string): Permissions | null {
    return this.rolesStore.getPermissions(role);
  }

  setRoles(roles: Roles): void {
    this.roles = roles;
    this.rolesStore.setRoles(roles);
  }

  // Steps
  does(...roles: string[]): DoesStep {
    return new DoesStep(
      { roles: RolesResolver(this.rolesStore, roles) },
      this.rolesStore,
    );
  }

  doesAny(...roles: string[]): DoesStep {
    return new DoesStep(
      { roles: RolesResolver(this.rolesStore, roles), any: true },
      this.rolesStore,
    );
  }

  allow(...roles: string[]): AllowStep {
    return new AllowStep(
      { roles: RolesResolver(this.rolesStore, roles) },
      this.rolesStore,
    );
  }

  grant(...roles: string[]): GrantStep {
    return new GrantStep(
      { roles: RolesResolver(this.rolesStore, roles) },
      this.rolesStore,
    );
  }

  deny(...roles: string[]): DenyStep {
    return new DenyStep(
      { roles: RolesResolver(this.rolesStore, roles) },
      this.rolesStore,
    );
  }

  remove(...roles: string[]): void {
    this.rolesStore.removeRoles(roles);
  }
}
