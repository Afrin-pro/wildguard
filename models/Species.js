const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  scientificName: { type: String, trim: true },
  description: { type: String, required: true },
  habitat: { type: String, required: true },
  conservationStatus: {
    type: String,
    enum: ['Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered', 'Extinct in Wild', 'Extinct'],
    required: true
  },
  category: { type: String, enum: ['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Invertebrate', 'Plant'], required: true },
  image: { type: String, default: '/images/species-default.svg' },
  population: { type: String },
  threats: [String],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedByAdmin: { type: Boolean, default: false },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Species', speciesSchema);
