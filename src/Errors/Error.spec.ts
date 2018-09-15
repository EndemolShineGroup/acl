import Error from './Error';

class ConcreteError extends Error {}

describe('Error', () => {
  it('returns an object containing the error properties', () => {
    const error = new ConcreteError('An error');
    expect(error.toObject()).toEqual({
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  });
});
