const express = require('express');
const router  = express.Router();
const Sighting     = require('../models/Sighting');
const Notification = require('../models/Notification');
const User         = require('../models/User');
const { requireLogin, requireAdmin } = require('../middleware/auth');

async function awardPoints(userId, pts, reason) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { conservationPoints: pts } },
      { new: true }
    );
    if (user) await user.checkAndAwardBadges();
  } catch(e) { console.error('awardPoints error:', e); }
}

// GET - map page
router.get('/', async (req, res) => {
  try {
    const sightings = await Sighting.find()
      .populate('reportedBy', 'username avatar')
      .sort({ createdAt: -1 });
    const sightingsJson = JSON.stringify(
      sightings.map(s => ({
        _id:         s._id,
        species:     s.species,
        description: s.description,
        location:    s.location,
        lat:         s.lat,
        lng:         s.lng,
        condition:   s.condition,
        count:       s.count,
        verified:    s.verified,
        image:       s.image,
        reportedBy:  s.reportedBy ? s.reportedBy.username : 'Unknown',
        createdAt:   s.createdAt
      }))
    );
    res.render('sightings/index', {
      title: 'Wildlife Sighting Map - WildGuard',
      sightings,
      sightingsJson
    });
  } catch(err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET - report form
router.get('/report', requireLogin, (req, res) => {
  res.render('sightings/report', { title: 'Report a Sighting - WildGuard' });
});

// POST - submit sighting
router.post('/report', requireLogin, async (req, res) => {
  try {
    const { species, description, location, lat, lng, count, condition, image } = req.body;
    await Sighting.create({
      species, description, location,
      lat:       lat  ? parseFloat(lat)  : null,
      lng:       lng  ? parseFloat(lng)  : null,
      count:     count ? parseInt(count) : 1,
      condition: condition || 'Unknown',
      image:     image || '',
      reportedBy: req.session.user._id
    });
    await awardPoints(req.session.user._id, 10, 'Reported a wildlife sighting');
    await Notification.create({
      user:    req.session.user._id,
      message: `Your sighting of "${species}" was submitted! +10 conservation points earned.`,
      type:    'system',
      link:    '/sightings'
    });
    req.session.success = `Sighting reported! You earned 10 conservation points 🌿`;
    res.redirect('/sightings');
  } catch(err) {
    console.error(err);
    req.session.error = 'Failed to submit sighting.';
    res.redirect('/sightings/report');
  }
});

// POST - verify (admin)
router.post('/:id/verify', requireAdmin, async (req, res) => {
  try {
    const s = await Sighting.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (s && s.reportedBy) {
      await awardPoints(s.reportedBy, 15, 'Sighting verified by admin');
      await Notification.create({
        user:    s.reportedBy,
        message: `Your sighting of "${s.species}" was verified! +15 bonus points.`,
        type:    'system',
        link:    '/sightings'
      });
    }
    req.session.success = 'Sighting verified!';
    res.redirect('/sightings');
  } catch(err) { res.redirect('/sightings'); }
});

// POST - delete (admin)
router.post('/:id/delete', requireAdmin, async (req, res) => {
  await Sighting.findByIdAndDelete(req.params.id);
  req.session.success = 'Sighting removed.';
  res.redirect('/sightings');
});

module.exports = router;
