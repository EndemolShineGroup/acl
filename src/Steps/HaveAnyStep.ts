import PermissionCheckStep from './PermissionCheckStep';
import Step from './Step';

export default class HaveAnyStep extends Step {
  for(environment: string): boolean {
    const roles: string[] = this.query.roles!;

    for (let i: number = 0; i < roles.length; i++) {
      if (
        new PermissionCheckStep(
          { ...this.query, role: roles[i], environment },
          this.parent,
        ).hasPermission()
      ) {
        return true;
      }
    }

    return false;
  }
}
