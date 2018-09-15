import Error from './Error';

type ActionType = 'deny' | 'grant';

export default class PermissionNotFoundError extends Error {
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
