const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler Utility', () => {
  test('should execute passed function and call next on error', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const expectedError = new Error('Async Failure');
    const fn = asyncHandler(async () => {
      throw expectedError;
    });

    await fn(req, res, next);
    expect(next).toHaveBeenCalledWith(expectedError);
  });
});