import { BaseError } from 'make-error';

export default abstract class Error extends BaseError {
  toObject = () => {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
    };
  };
}
