import AbstractError from './AbstractError';

type ActionType = 'deny' | 'grant';

export default class PermissionNotFoundError extends AbstractError {
  constructor(
    roleName: string,
    permission?: string,
    action: ActionType = 'deny',
  ) {
    let message = `No permissions found for ${roleName}`;

    if (action) {
      message = `Cannot ${action} ${permission}. ${message}`;
    }

    super(message);
  }
}
