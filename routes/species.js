const express = require('express');
const router = express.Router();
const Species = require('../models/Species');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// GET All Species
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = { approvedByAdmin: true };
    if (category) query.category = category;
    if (status) query.conservationStatus = status;
    if (search) query.name = { $regex: search, $options: 'i' };
    const species = await Species.find(query).sort({ createdAt: -1 });
    res.render('species/index', { title: 'Species Directory - WildGuard', species, category, status, search });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET Single Species
router.get('/:id', async (req, res) => {
  try {
    const species = await Species.findById(req.params.id).populate('addedBy', 'username');
    if (!species || !species.approvedByAdmin) { req.session.error = 'Species not found.'; return res.redirect('/species'); }
    res.render('species/show', { title: `${species.name} - WildGuard`, species });
  } catch (err) {
    console.error(err);
    res.redirect('/species');
  }
});

// GET Report Species (User)
router.get('/report/new', requireLogin, (req, res) => {
  res.render('species/report', { title: 'Report Species - WildGuard' });
});

// POST Report Species
router.post('/report/new', requireLogin, async (req, res) => {
  try {
    const { name, scientificName, description, habitat, conservationStatus, category, population, image } = req.body;
    const threats = req.body.threats ? req.body.threats.split(',').map(t => t.trim()) : [];
    const sp = await Species.create({ name, scientificName, description, habitat, conservationStatus, category, population, threats, image: image || '/images/species-default.svg', addedBy: req.session.user._id, reportedBy: req.session.user._id, approvedByAdmin: false });
    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({ user: admin._id, message: `New species "${name}" reported by ${req.session.user.username} — awaiting approval.`, type: 'admin', link: `/admin/species` });
    }
    req.session.success = 'Species reported! An admin will review it soon.';
    res.redirect('/species');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to report species.';
    res.redirect('/species/report/new');
  }
});

module.exports = router;
