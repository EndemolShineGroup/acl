import RoleNotFoundError from './RoleNotFoundError';

describe('RoleNotFoundError', () => {
  it('uses the default message when only roleName is provided', () => {
    const roleName = 'TestRole';
    const error = new RoleNotFoundError(roleName);
    expect(error.message).toContain(roleName);
  });

  it('adds extra information when provided', () => {
    const roleName = 'TestRole';
    const reason = 'A reason why';
    const error = new RoleNotFoundError(roleName, reason);
    expect(error.message).toContain(roleName);
    expect(error.message).toContain(reason);
  });
});
