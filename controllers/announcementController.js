const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

exports.getEventAnnouncements = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ event: req.params.eventId })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 });
  res.status(200).json({ status: 'success', results: messages.length, data: { messages } });
});
