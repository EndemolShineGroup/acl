import HaveStep from './HaveStep';
import Step from './Step';

export default class DoesStep extends Step {
  havePermission(permission: string): HaveStep {
    return new HaveStep({ ...this.query, permission }, this.parent);
  }
}
