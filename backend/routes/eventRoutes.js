const express = require('express');
const { 
    getEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    registerForEvent,
    getParticipants
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/public-stats', async (req, res) => {
    try {
        const User = require('../models/User');
        const Event = require('../models/Event');
        
        const totalEvents = await Event.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalSocieties = await User.distinct('society', { role: 'admin' });
        
        res.json({
            events: totalEvents,
            members: totalUsers,
            clubs: totalSocieties.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public stats' });
    }
});

router.get('/my-events', protect, authorize('admin', 'superadmin'), (req, res, next) => {
    req.query.mine = 'true';
    next();
}, getEvents);

router.route('/')
    .get(getEvents)
    .post(protect, authorize('admin', 'superadmin'), createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, authorize('admin', 'superadmin'), updateEvent)
    .delete(protect, authorize('admin', 'superadmin'), deleteEvent);

router.post('/:id/register', protect, registerForEvent);
router.get('/registered', protect, async (req, res) => {
    try {
        const registrations = await Registration.find({ userId: req.user._id }).populate('eventId');
        const events = registrations.map(reg => reg.eventId).filter(event => event !== null);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registered events' });
    }
});

router.get('/:id/participants', protect, authorize('admin', 'superadmin'), getParticipants);

module.exports = router;
