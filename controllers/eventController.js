const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(201).json({ status: 'success', data: { event } });
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, search, sort, page = 1, limit = 10 } = req.query;
  let query = {};

  if (category) query.category = category;
  if (city) query.city = new RegExp(city, 'i');
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (search) {
    query.$text = { $search: search };
  }

  let reqQuery = Event.find(query).populate('category');

  if (sort === 'popularity') {
    reqQuery = reqQuery.sort({ registrationCount: -1 });
  } else if (sort === 'date') {
    reqQuery = reqQuery.sort({ date: 1 });
  } else {
    reqQuery = reqQuery.sort({ createdAt: -1 });
  }

  const skip = (page - 1) * limit;
  reqQuery = reqQuery.skip(skip).limit(Number(limit));

  const events = await reqQuery;
  const total = await Event.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: events.length,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    data: { events }
  });
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('category');
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', data: { event } });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', data: { event } });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
