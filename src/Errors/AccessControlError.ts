import AbstractError from './AbstractError';

export default class AccessControlError extends AbstractError {
  constructor(message?: string) {
    const defaultMessage = `AccessControl setup incorrectly. Please set grants before usage`;
    super(message || defaultMessage);
  }
}
