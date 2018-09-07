import { ACStep, DenyPermissionStep } from './';

export default class DenyStep extends ACStep {
  permission(permissionName: string): DenyPermissionStep {
    return new DenyPermissionStep({...this.query, permission: permissionName}, this.parent);
  }
}
