const AppError = require('../../utils/AppError');

describe('AppError Utility Class', () => {
  test('should create operational 4xx fail error correctly', () => {
    const err = new AppError('Not found', 404);
    expect(err.statusCode).toBe(404);
    expect(err.status).toBe('fail');
    expect(err.isOperational).toBe(true);
    expect(err).toBeInstanceOf(Error);
  });

  test('should default 5xx status to error', () => {
    const err = new AppError('Server error', 500);
    expect(err.statusCode).toBe(500);
    expect(err.status).toBe('error');
    expect(err.isOperational).toBe(true);
  });
});