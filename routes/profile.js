const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const { requireLogin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads/avatars';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.get('/', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate('registeredEvents');
    const registeredEvents = await Event.find({ registeredUsers: req.session.user._id }).sort({ date: 1 });
    res.render('profile', { title: 'My Profile - WildGuard', profileUser: user, registeredEvents });
  } catch (err) {
    res.redirect('/');
  }
});

router.post('/update', requireLogin, upload.single('avatar'), async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updates = { username, bio };
    if (req.file) updates.avatar = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.session.user._id, updates, { new: true });
    req.session.user = { ...req.session.user, username: user.username, avatar: user.avatar };
    req.session.success = 'Profile updated!';
    res.redirect('/profile');
  } catch (err) {
    req.session.error = 'Failed to update profile.';
    res.redirect('/profile');
  }
});

module.exports = router;
