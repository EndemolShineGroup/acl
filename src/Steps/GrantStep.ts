import GrantPermissionStep from './GrantPermissionStep';
import Step from './Step';

export default class GrantStep extends Step {
  permission(permissionName: string): GrantPermissionStep {
    return new GrantPermissionStep(
      { ...this.query, permission: permissionName },
      this.parent,
    );
  }
}
