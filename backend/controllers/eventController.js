const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, capacity, image } = req.body;
        const event = await Event.create({
            title,
            description,
            date,
            venue,
            capacity,
            image,
            createdBy: req.user._id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        let query = {};
        if (req.query.mine === 'true' && req.user) {
            query.createdBy = req.user._id;
        }
        const events = await Event.find(query).populate('createdBy', 'name');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check ownership (only creator or superadmin can update)
        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await event.deleteOne();
        // Also delete registrations
        await Registration.deleteMany({ eventId: req.params.id });
        
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Check only dates

        if (eventDate < today) {
            return res.status(400).json({ message: 'Registration for past events is not allowed' });
        }

        const alreadyRegistered = await Registration.findOne({
            userId: req.user._id,
            eventId: event._id
        });

        if (alreadyRegistered) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        await Registration.create({
            userId: req.user._id,
            eventId: event._id
        });

        event.registeredCount += 1;
        await event.save();

        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getParticipants = async (req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.id }).populate('userId', 'name email');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
