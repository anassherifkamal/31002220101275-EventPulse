const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 1. Mongoose CastError (Invalid ObjectId format, e.g. GET /api/events/invalid-id)
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // 2. Mongoose Duplicate Key Error (code 11000, e.g. duplicate email registration)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`Duplicate field value entered for ${field}`, 409);
  }

  // 3. Mongoose ValidationError (Missing required Schema fields)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    error = new AppError(`Invalid input data: ${messages.join('. ')}`, 400);
  }

  // 4. JWT JsonWebTokenError (Malformed or invalid signature)
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again!', 401);
  }

  // 5. JWT TokenExpiredError (Token expired)
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired! Please log in again.', 401);
  }

  // 6. Send Response
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  res.status(statusCode).json({
    status,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;