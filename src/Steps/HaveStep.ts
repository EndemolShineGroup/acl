import PermissionCheckStep from './PermissionCheckStep';
import Step from './Step';

export default class HaveStep extends Step {
  for(environment: string):boolean {
    return new PermissionCheckStep({...this.query, environment}, this.parent).hasPermission();
  }
}
