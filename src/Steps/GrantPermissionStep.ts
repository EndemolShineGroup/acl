import { GrantQuery, Roles } from '../types';
import Step from './Step';

import EnvsResolver from '../Resolvers/EnvsResolver';

export default class GrantPermissionStep extends Step {
  for(...stages: string[]): void {
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
        roles[role] = {};
      }

      query.permissions.forEach((permission: string) => {
        if (!roles[role][permission]) {
          roles[role][permission] = {
            dev: false,
            prod: false,
            staging: false,
          };
        }

        query.environments.forEach((env: string) => {
          roles[role][permission][env] = true;
        });
      });
    });

    this.rolesStore.modifyRoles(roles);
  }
}
