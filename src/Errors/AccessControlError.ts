import Error from './Error';

export default class AccessControlError extends Error {
  constructor(message?: string) {
    const defaultMessage = `AccessControl setup incorrectly. Please set grants before usage`;
    super(message || defaultMessage);
  }
}
