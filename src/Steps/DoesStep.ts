import HaveStep from './HaveStep';
import Step from './Step';

import PermissionsResolver from '../Resolvers/PermissionResolver';

export default class DoesStep extends Step {
  havePermissions(...permissions: string[]): HaveStep {
    return new HaveStep(
      {
        ...this.query,
        permissions: PermissionsResolver(
          this.rolesStore,
          this.query.roles!,
          ...permissions,
        ),
      },
      this.rolesStore,
    );
  }
}
