const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, minlength: 6 },
  avatar:     { type: String, default: '/images/default-avatar.svg' },
  role:       { type: String, enum: ['user','admin'], default: 'user' },
  bio:        { type: String, maxlength: 300, default: '' },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  conservationPoints: { type: Number, default: 0 },
  badges: [{
    name:     String,
    icon:     String,
    earnedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(pw) {
  return bcrypt.compare(pw, this.password);
};

const BADGE_THRESHOLDS = [
  { points: 10,   name: 'First Steps',        icon: '🌱' },
  { points: 50,   name: 'Wildlife Watcher',   icon: '🔭' },
  { points: 100,  name: 'Conservation Hero',  icon: '🦸' },
  { points: 250,  name: 'Species Guardian',   icon: '🛡️' },
  { points: 500,  name: 'Wildlife Champion',  icon: '🏆' },
  { points: 1000, name: 'Legend of the Wild', icon: '👑' }
];

userSchema.methods.checkAndAwardBadges = async function() {
  const earned = this.badges.map(b => b.name);
  let newBadges = [];
  for (const t of BADGE_THRESHOLDS) {
    if (this.conservationPoints >= t.points && !earned.includes(t.name)) {
      this.badges.push({ name: t.name, icon: t.icon });
      newBadges.push(t);
    }
  }
  if (newBadges.length) await this.save();
  return newBadges;
};

module.exports = mongoose.model('User', userSchema);
