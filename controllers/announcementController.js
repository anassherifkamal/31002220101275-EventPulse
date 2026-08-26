const Message = require('../models/Message');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/announcements - Admin sends real-time announcement
exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;
  
  // Safeguard: handle both req.user._id and req.user.userId / req.user.id
  const adminId = req.user._id || req.user.userId || req.user.id;

  if (!eventId || !text) {
    return next(new AppError('Please provide both eventId and text', 400));
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // 1. Save to MongoDB
  const message = await Message.create({
    event: eventId,
    sender: adminId,
    text,
  });

  // 2. Populate sender info
  await message.populate('sender', 'name email role');

  // 3. Emit real-time socket event
  const io = req.app.get('io');
  if (io) {
    io.to(eventId.toString()).emit('announcement', message);
  }

  res.status(201).json({
    status: 'success',
    data: message,
  });
});

// GET /api/announcements/:eventId - Fetch past announcements
exports.getEventAnnouncements = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  // Ensure event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const messages = await Message.find({ event: eventId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});