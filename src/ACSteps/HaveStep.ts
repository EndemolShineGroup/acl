import { ACStep, PermissionCheckStep } from './';

export default class HaveStep extends ACStep{
  for(environment: string):boolean {
    return new PermissionCheckStep({...this.query, environment}, this.parent).hasPermission();
  }
}
