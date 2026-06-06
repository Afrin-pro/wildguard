const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema({
  species:     { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location:    { type: String, required: true },
  lat:         { type: Number, default: null },
  lng:         { type: Number, default: null },
  image:       { type: String, default: '' },
  count:       { type: Number, default: 1 },
  condition:   { type: String, enum: ['Healthy','Injured','Dead','Unknown'], default: 'Unknown' },
  reportedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified:    { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sighting', sightingSchema);
