import { ACStep, GrantPermissionStep } from './';

export default class GrantStep extends ACStep {
  permission(permissionName: string): GrantPermissionStep {
    return new GrantPermissionStep({...this.query, permission: permissionName}, this.parent);
  }
}
