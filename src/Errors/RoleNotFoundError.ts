import Error from './Error';

export default class RoleNotFoundError extends Error {
  constructor(roleName: string, extraInfo?: string) {
    let message = `Role ${roleName} does not exist`;

    if (extraInfo) {
      message += ` ${extraInfo}`;
    }

    super(message);
  }
}
