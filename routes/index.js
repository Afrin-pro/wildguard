const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Species = require('../models/Species');

router.get('/', async (req, res) => {
  try {
    const upcomingEvents = await Event.find({ isActive: true, date: { $gte: new Date() } })
      .sort({ date: 1 }).limit(3).populate('createdBy', 'username');
    const featuredSpecies = await Species.find({ approvedByAdmin: true })
      .sort({ createdAt: -1 }).limit(4);
    const stats = {
      events: await Event.countDocuments({ isActive: true }),
      species: await Species.countDocuments({ approvedByAdmin: true }),
    };
    res.render('index', { title: 'WildGuard - Wildlife Conservation', upcomingEvents, featuredSpecies, stats });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'WildGuard', upcomingEvents: [], featuredSpecies: [], stats: { events: 0, species: 0 } });
  }
});

module.exports = router;
