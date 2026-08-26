const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
  city: { type: String, required: [true, 'City is required'] },
  date: { type: Date, required: [true, 'Date is required'] },
  capacity: { type: Number, required: [true, 'Capacity is required'], min: [1, 'Capacity must be at least 1'] },
  registrationCount: { type: Number, default: 0 }
}, { timestamps: true });

eventSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Event', eventSchema);
