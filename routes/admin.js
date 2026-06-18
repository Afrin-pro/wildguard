const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Species = require('../models/Species');
const Notification = require('../models/Notification');
const { requireAdmin } = require('../middleware/auth');

// Admin Dashboard
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [users, events, approvedSpecies, pendingSpecies] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments({ isActive: true }),
      Species.countDocuments({ approvedByAdmin: true }),
      Species.countDocuments({ approvedByAdmin: false })
    ]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    res.render('admin/dashboard', { title: 'Admin Dashboard - WildGuard', stats: { users, events, approvedSpecies, pendingSpecies }, recentUsers });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Manage Species
router.get('/species', requireAdmin, async (req, res) => {
  try {
    const pending = await Species.find({ approvedByAdmin: false }).populate('addedBy', 'username');
    const approved = await Species.find({ approvedByAdmin: true }).sort({ createdAt: -1 });
    res.render('admin/species', { title: 'Manage Species - WildGuard', pending, approved });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// Approve Species
router.post('/species/:id/approve', requireAdmin, async (req, res) => {
  try {
    const sp = await Species.findByIdAndUpdate(req.params.id, { approvedByAdmin: true }, { new: true }).populate('addedBy');
    if (sp && sp.addedBy) {
      await Notification.create({ user: sp.addedBy._id, message: `Your species report "${sp.name}" has been approved and is now live!`, type: 'species', link: `/species/${sp._id}` });
    }
    req.session.success = 'Species approved!';
    res.redirect('/admin/species');
  } catch (err) {
    req.session.error = 'Failed to approve species.';
    res.redirect('/admin/species');
  }
});

// Delete Species
router.post('/species/:id/delete', requireAdmin, async (req, res) => {
  try {
    const sp = await Species.findByIdAndDelete(req.params.id);
    if (sp && sp.addedBy) {
      await Notification.create({ user: sp.addedBy, message: `Your species report "${sp.name}" was reviewed and not approved.`, type: 'admin' });
    }
    req.session.success = 'Species removed.';
    res.redirect('/admin/species');
  } catch (err) {
    res.redirect('/admin/species');
  }
});

// Manage Users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { title: 'Manage Users - WildGuard', users });
  } catch (err) {
    res.redirect('/admin');
  }
});

// Toggle Admin Role
router.post('/users/:id/toggle-role', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { req.session.error = 'User not found.'; return res.redirect('/admin/users'); }
    if (user._id.toString() === req.session.user._id.toString()) { req.session.error = "You can't change your own role."; return res.redirect('/admin/users'); }
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    req.session.success = `${user.username} is now ${user.role}.`;
    res.redirect('/admin/users');
  } catch (err) {
    res.redirect('/admin/users');
  }
});

module.exports = router;
