const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, enum: ['Conservation', 'Cleanup', 'Research', 'Education', 'Fundraiser'], default: 'Conservation' },
  image: { type: String, default: '/images/event-default.svg' },
  capacity: { type: Number, default: 50 },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

eventSchema.virtual('spotsLeft').get(function() {
  return this.capacity - this.registeredUsers.length;
});

module.exports = mongoose.model('Event', eventSchema);
