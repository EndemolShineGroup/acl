import PermissionNotFoundError from './PermissionNotFoundError';

describe('PermissionNotFoundError', () => {
  it('uses the default message when only roleName is provided', () => {
    const roleName = 'TestRole';
    const error = new PermissionNotFoundError(roleName);
    expect(error.message).toContain(roleName);
  });

  it('adds extra information when provided', () => {
    const roleName = 'TestRole';
    const permission = 'addUser';
    const action = 'deny';
    const error = new PermissionNotFoundError(roleName, permission, action);
    expect(error.message).toContain(action);
    expect(error.message).toContain(permission);
    expect(error.message).toContain(roleName);
  });
});
