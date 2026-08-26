const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Email already in use', 400));

  const newUser = await User.create({ name, email, password, role: role || 'attendee' });
  newUser.password = undefined;

  res.status(201).json({ status: 'success', data: { user: newUser } });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id, user.role);
  res.status(200).json({ status: 'success', token });
});
