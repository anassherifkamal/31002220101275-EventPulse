const Registration = require('../models/Registration');
const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return next(new AppError('Event not found', 404));

  if (event.registrationCount >= event.capacity) {
    return next(new AppError('Event capacity reached', 400));
  }

  const existingReg = await Registration.findOne({ user: req.user._id, event: eventId });
  if (existingReg) return next(new AppError('You are already registered for this event', 400));

  const registration = await Registration.create({ user: req.user._id, event: eventId });
  event.registrationCount += 1;
  await event.save();

  res.status(201).json({ status: 'success', data: { registration } });
});

exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const registrations = await Registration.find({ user: req.user._id }).populate({
    path: 'event',
    populate: { path: 'category' }
  });
  res.status(200).json({ status: 'success', results: registrations.length, data: { registrations } });
});

exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!registration) return next(new AppError('Registration not found or unauthorized', 404));

  await Event.findByIdAndUpdate(registration.event, { $inc: { registrationCount: -1 } });
  res.status(204).json({ status: 'success', data: null });
});
