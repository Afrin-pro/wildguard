const express  = require('express');
const router   = express.Router();
const Adoption     = require('../models/Adoption');
const Species      = require('../models/Species');
const User         = require('../models/User');
const Notification = require('../models/Notification');
const { requireLogin } = require('../middleware/auth');

const TIERS = {
  Supporter: { amount: 5,  points: 50,  color: '#52b788', perks: ['Digital certificate','Name on species page','50 conservation points'] },
  Guardian:  { amount: 15, points: 150, color: '#f4a261', perks: ['All Supporter perks','Monthly update email','150 conservation points'] },
  Champion:  { amount: 30, points: 300, color: '#e63946', perks: ['All Guardian perks','Conservation impact report','300 conservation points'] }
};

// GET - adoptions page
router.get('/', requireLogin, async (req, res) => {
  try {
    const myAdoptions = await Adoption.find({ user: req.session.user._id, active: true })
      .populate('species', 'name image conservationStatus scientificName');
    const availableSpecies = await Species.find({ approvedByAdmin: true }).sort({ name: 1 });

    const sponsorCounts = await Adoption.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$species', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);
    const sponsorMap = {};
    sponsorCounts.forEach(s => { sponsorMap[s._id.toString()] = { count: s.count, total: s.total }; });

    res.render('adoptions/index', {
      title: 'Adopt a Species - WildGuard',
      myAdoptions,
      availableSpecies,
      TIERS,
      sponsorMap
    });
  } catch(err) {
    console.error(err);
    res.redirect('/');
  }
});

// POST - adopt  (must be before /:id routes)
router.post('/adopt', requireLogin, async (req, res) => {
  try {
    const { speciesId, tier, message } = req.body;
    if (!TIERS[tier]) { req.session.error = 'Invalid tier.'; return res.redirect('/adoptions'); }

    const species = await Species.findById(speciesId);
    if (!species) { req.session.error = 'Species not found.'; return res.redirect('/adoptions'); }

    const existing = await Adoption.findOne({ user: req.session.user._id, species: speciesId, active: true });
    if (existing) {
      req.session.error = `You already sponsor ${species.name}! Cancel first to change tier.`;
      return res.redirect('/adoptions');
    }

    const certId = `WG-${Date.now().toString(36).toUpperCase()}`;
    await Adoption.create({
      user:        req.session.user._id,
      species:     speciesId,
      tier,
      amount:      TIERS[tier].amount,
      message:     message || '',
      certificate: certId
    });

    const user = await User.findByIdAndUpdate(
      req.session.user._id,
      { $inc: { conservationPoints: TIERS[tier].points } },
      { new: true }
    );
    if (user) await user.checkAndAwardBadges();

    await Notification.create({
      user:    req.session.user._id,
      message: `🎉 You are now a ${tier} sponsor of ${species.name}! Certificate: ${certId}. +${TIERS[tier].points} points.`,
      type:    'species',
      link:    '/adoptions'
    });

    req.session.success = `You adopted ${species.name} as a ${tier}! Certificate: ${certId} 🎉`;
    res.redirect('/adoptions');
  } catch(err) {
    console.error(err);
    req.session.error = 'Adoption failed. Please try again.';
    res.redirect('/adoptions');
  }
});

// GET - certificate  (must be before /:id/cancel)
router.get('/:id/certificate', requireLogin, async (req, res) => {
  try {
    const adoption = await Adoption.findOne({ _id: req.params.id, user: req.session.user._id })
      .populate('species', 'name scientificName image conservationStatus habitat')
      .populate('user', 'username');

    if (!adoption) {
      req.session.error = 'Certificate not found.';
      return res.redirect('/adoptions');
    }

    const tierColors = {
      Supporter: { primary: '#52b788', secondary: '#d8f3dc', label: '🌱 Supporter' },
      Guardian:  { primary: '#f4a261', secondary: '#fff3cd', label: '🛡️ Guardian'  },
      Champion:  { primary: '#e63946', secondary: '#ffe0e0', label: '🏆 Champion'  }
    };

    res.render('adoptions/certificate', {
      title: `Certificate - ${adoption.species.name}`,
      adoption,
      tierColor: tierColors[adoption.tier] || tierColors.Supporter
    });
  } catch(err) {
    console.error(err);
    res.redirect('/adoptions');
  }
});

// POST - cancel adoption
router.post('/:id/cancel', requireLogin, async (req, res) => {
  try {
    const adoption = await Adoption.findOne({ _id: req.params.id, user: req.session.user._id });
    if (adoption) { adoption.active = false; await adoption.save(); }
    req.session.success = 'Sponsorship cancelled.';
    res.redirect('/adoptions');
  } catch(err) { res.redirect('/adoptions'); }
});

module.exports = router;
