const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find().sort({ date: 1 });

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: events,
  });
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin only)
exports.createEvent = asyncHandler(async (req, res, next) => {
  const newEvent = await Event.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: newEvent,
  });
});

// @desc    Update event details
// @route   PATCH /api/events/:id
// @access  Private (Admin only)
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedEvent) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedEvent,
  });
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});