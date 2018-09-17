import AbstractError from './AbstractError';

class ConcreteError extends AbstractError {}

describe('AbstractError', () => {
  it('returns an object containing the error properties', () => {
    const error = new ConcreteError('An error');
    expect(error.toObject()).toEqual({
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  });
});
