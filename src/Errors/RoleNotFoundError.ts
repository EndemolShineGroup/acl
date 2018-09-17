import AbstractError from './AbstractError';

export default class RoleNotFoundError extends AbstractError {
  constructor(roleName: string, extraInfo?: string) {
    let message = `Role ${roleName} does not exist`;

    if (extraInfo) {
      message += ` ${extraInfo}`;
    }

    super(message);
  }
}
