import GrantPermissionStep from './GrantPermissionStep';
import Step from './Step';

import PermissionResolver from '../Resolvers/PermissionResolver';

export default class GrantStep extends Step {
  permission(...permissions: string[]): GrantPermissionStep {
    return new GrantPermissionStep(
      {
        ...this.query,
        permissions: PermissionResolver(
          this.rolesStore,
          this.query.roles!,
          ...permissions,
        ),
      },
      this.rolesStore,
    );
  }
}
