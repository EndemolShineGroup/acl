import AccessControlError from './AccessControlError';

describe('AccessControlError', () => {
  it('uses the default message when no message is provided', () => {
    const error = new AccessControlError();
    expect(error.message).toContain('AccessControl setup incorrectly');
  });

  it('adds extra information when provided', () => {
    const message = `Something's wrong`;
    const error = new AccessControlError(message);
    expect(error.message).toEqual(message);
  });
});
