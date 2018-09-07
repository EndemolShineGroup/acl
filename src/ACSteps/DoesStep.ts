import { ACStep, HaveStep } from './';

export default class DoesStep extends ACStep {
  havePermission(permission: string):HaveStep {
    return new HaveStep({...this.query, permission}, this.parent);
  }
}
