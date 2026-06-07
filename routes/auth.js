const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const { redirectIfLoggedIn } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads/avatars';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'));
}});

// GET Login
router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('auth/login', { title: 'Login - WildGuard' });
});

// POST Login
router.post('/login', redirectIfLoggedIn, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.session.error = 'Please fill in all fields.';
      return res.redirect('/auth/login');
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/auth/login');
    }
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar };
    req.session.success = `Welcome back, ${user.username}! 🌿`;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.session.error = 'Login failed. Try again.';
    res.redirect('/auth/login');
  }
});

// GET Signup
router.get('/signup', redirectIfLoggedIn, (req, res) => {
  res.render('auth/signup', { title: 'Join WildGuard' });
});

// POST Signup
router.post('/signup', redirectIfLoggedIn, upload.single('avatar'), async (req, res) => {
  try {
    const { username, email, password, confirmPassword, bio } = req.body;
    if (!username || !email || !password) {
      req.session.error = 'Please fill in all required fields.';
      return res.redirect('/auth/signup');
    }
    if (password !== confirmPassword) {
      req.session.error = 'Passwords do not match.';
      return res.redirect('/auth/signup');
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      req.session.error = existing.email === email ? 'Email already registered.' : 'Username already taken.';
      return res.redirect('/auth/signup');
    }
    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : '/images/default-avatar.svg';
    const user = await User.create({ username, email, password, bio, avatar: avatarPath });
    await Notification.create({ user: user._id, message: `Welcome to WildGuard, ${username}! Start exploring our conservation efforts.`, type: 'system' });
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar };
    req.session.success = `Welcome to WildGuard, ${username}! 🦁`;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.session.error = err.code === 11000 ? 'Email or username already exists.' : 'Signup failed. Try again.';
    res.redirect('/auth/signup');
  }
});

// POST Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
