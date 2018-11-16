import each from 'lodash.foreach';

import PermissionNotFoundError from '../Errors/PermissionNotFoundError';
import RoleNotFoundError from '../Errors/RoleNotFoundError';
import { GrantQuery, Roles } from '../types';
import Step from './Step';

import EnvsResolver from '../Resolvers/EnvsResolver';

export default class DenyPermissionStep extends Step {
  for(...stages: string[]): void {
    this.checkRolesExist();

    const roles: Roles = this.rolesStore.getRoles();

    const query: GrantQuery = this.query as GrantQuery;

    query.environments = EnvsResolver(
      this.rolesStore,
      query.roles,
      query.permissions,
      ...stages,
    );

    query.roles.forEach((role: string) => {
      if (!roles[role]) {
        throw new RoleNotFoundError(role);
      }

      query.permissions.forEach((permission: string) => {
        if (!roles[role][permission]) {
          throw new PermissionNotFoundError(role, permission, 'deny');
        }

        query.environments.forEach((env: string) => {
          roles[role][permission][env] = false;
        });
      });
    });

    this.rolesStore.modifyRoles(roles);
  }
}
