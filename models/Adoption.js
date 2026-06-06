const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  species:     { type: mongoose.Schema.Types.ObjectId, ref: 'Species', required: true },
  tier:        { type: String, enum: ['Supporter','Guardian','Champion'], required: true },
  amount:      { type: Number, required: true },
  message:     { type: String, default: '' },
  certificate: { type: String },
  active:      { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Adoption', adoptionSchema);
