import { ACStep, HaveAnyStep } from './';

export default class DoesAnyStep extends ACStep {
  havePermission(permission: string):HaveAnyStep {
    return new HaveAnyStep({...this.query, permission}, this.parent);
  }
}
