const { body, param } = require('express-validator');

exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.createEventValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').isMongoId().withMessage('Category must be a valid MongoId'),
  body('date').isISO8601().withMessage('Date must be a valid ISO8601 date'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
];

exports.updateEventValidator = [
  param('id').isMongoId().withMessage('Invalid Event ID format'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('category').optional().isMongoId().withMessage('Category must be a valid MongoId'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
];

exports.registrationValidator = [
  body('event').isMongoId().withMessage('event must be a valid MongoId'),
];