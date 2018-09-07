import { ACStep, PermissionCheckStep } from './';
import { Stage } from '../types';

export default class HaveStep extends ACStep{
  for(environment: Stage):boolean {
    return new PermissionCheckStep({...this.query, environment}, this.parent).hasPermission();
  }
}
