const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/registrations - Register logged-in user for an event
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const eventId = req.body.event;

  if (!eventId) {
    return next(new AppError('Please provide an event ID', 400));
  }

  // 1. Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // 2. Check for duplicate registration
  const existingRegistration = await Registration.findOne({
    event: eventId,
    attendee: userId,
  });
  if (existingRegistration) {
    return next(new AppError('You are already registered for this event', 400));
  }

  // 3. Enforce event capacity
  const currentCount = await Registration.countDocuments({ event: eventId });
  if (currentCount >= event.capacity) {
    return next(new AppError('This event is full', 400));
  }

  // 4. Create registration
  const registration = await Registration.create({
    event: eventId,
    attendee: userId,
  });

  res.status(201).json({
    status: 'success',
    data: registration,
  });
});

// GET /api/registrations/my - Get registrations for the logged-in user
exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  const registrations = await Registration.find({ attendee: userId }).populate({
    path: 'event',
    select: 'title description date city venue capacity',
  });

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations,
  });
});

// DELETE /api/registrations/:id - Cancel a registration
exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const registrationId = req.params.id;

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  // Ownership check: users can only cancel their own registrations
  if (registration.attendee.toString() !== userId) {
    return next(new AppError('You can only cancel your own registration', 403));
  }

  await registration.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Registration cancelled successfully',
  });
});