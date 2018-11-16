import PermissionCheckStep from './PermissionCheckStep';
import Step from './Step';

import EnvsResolver from '../Resolvers/EnvsResolver';

export default class HaveStep extends Step {
  for(...environments: string[]): boolean {
    return new PermissionCheckStep(
      {
        ...this.query,
        environments: EnvsResolver(
          this.rolesStore,
          this.query.roles!,
          this.query.permissions!,
          ...environments,
        ),
      },
      this.rolesStore,
    ).hasPermission();
  }
}
