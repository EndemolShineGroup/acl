import DenyPermissionStep from './DenyPermissionStep';
import Step from './Step';

import PermissionResolver from '../Resolvers/PermissionResolver';

export default class DenyStep extends Step {
  permission(...permissions: string[]): DenyPermissionStep {
    return new DenyPermissionStep(
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
