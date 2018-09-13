import HaveAnyStep from './HaveAnyStep';
import Step from './Step';

export default class DoesAnyStep extends Step {
  havePermission(permission: string): HaveAnyStep {
    return new HaveAnyStep({ ...this.query, permission }, this.parent);
  }
}
