import DenyPermissionStep from './DenyPermissionStep';
import Step from './Step';

export default class DenyStep extends Step {
  permission(permissionName: string): DenyPermissionStep {
    return new DenyPermissionStep(
      { ...this.query, permission: permissionName },
      this.parent,
    );
  }
}
