const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// GET All Events
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    const events = await Event.find(query).sort({ date: 1 }).populate('createdBy', 'username');
    res.render('events/index', { title: 'Conservation Events - WildGuard', events, category, search });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET Single Event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'username').populate('registeredUsers', 'username avatar');
    if (!event) { req.session.error = 'Event not found.'; return res.redirect('/events'); }
    const isRegistered = req.session.user ? event.registeredUsers.some(u => u._id.toString() === req.session.user._id.toString()) : false;
    res.render('events/show', { title: `${event.title} - WildGuard`, event, isRegistered });
  } catch (err) {
    console.error(err);
    res.redirect('/events');
  }
});

// POST Register for event
router.post('/:id/register', requireLogin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) { req.session.error = 'Event not found.'; return res.redirect('/events'); }
    const userId = req.session.user._id;
    const already = event.registeredUsers.includes(userId);
    if (already) {
      event.registeredUsers.pull(userId);
      await event.save();
      req.session.success = 'You have unregistered from this event.';
    } else {
      if (event.registeredUsers.length >= event.capacity) {
        req.session.error = 'Event is at full capacity.';
        return res.redirect(`/events/${req.params.id}`);
      }
      event.registeredUsers.push(userId);
      await event.save();
      await Notification.create({ user: userId, message: `You registered for "${event.title}" on ${event.date.toDateString()}.`, type: 'event', link: `/events/${event._id}` });
      req.session.success = `Successfully registered for "${event.title}"!`;
    }
    res.redirect(`/events/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/events');
  }
});

// Admin: GET Create Event Form
router.get('/admin/create', requireAdmin, (req, res) => {
  res.render('events/create', { title: 'Create Event - WildGuard' });
});

// Admin: POST Create Event
router.post('/admin/create', requireAdmin, async (req, res) => {
  try {
    const { title, description, date, location, category, capacity, image } = req.body;
    await Event.create({ title, description, date, location, category, capacity: capacity || 50, image: image || '/images/event-default.svg', createdBy: req.session.user._id });
    req.session.success = 'Event created successfully!';
    res.redirect('/events');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to create event.';
    res.redirect('/events/admin/create');
  }
});

// Admin: POST Delete Event
router.post('/:id/delete', requireAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    req.session.success = 'Event deleted.';
    res.redirect('/events');
  } catch (err) {
    res.redirect('/events');
  }
});

module.exports = router;
