const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { requireLogin } = require('../middleware/auth');

router.get('/', requireLogin, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.session.user._id }).sort({ createdAt: -1 }).limit(50);
    await Notification.updateMany({ user: req.session.user._id, read: false }, { read: true });
    res.render('notifications', { title: 'Notifications - WildGuard', notifications });
  } catch (err) {
    res.redirect('/');
  }
});

router.get('/count', requireLogin, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.session.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.json({ count: 0 });
  }
});

module.exports = router;
