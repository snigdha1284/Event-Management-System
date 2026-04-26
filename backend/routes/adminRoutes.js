const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Get system stats (Super Admin only)
router.get('/stats', protect, authorize('superadmin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalEvents = await Event.countDocuments();
        const totalRegistrations = await Registration.countDocuments();
        
        res.json({
            totalUsers,
            totalAdmins,
            totalEvents,
            totalRegistrations,
            systemHealth: 'Optimal'
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// Get all users (Super Admin only)
router.get('/users', protect, authorize('superadmin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// Update user role
router.patch('/users/:id/role', protect, authorize('superadmin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.role = req.body.role;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating role' });
    }
});

// Delete user
router.delete('/users/:id', protect, authorize('superadmin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting user' });
    }
});

// Delete event
router.delete('/events/:id', protect, authorize('superadmin'), async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting event' });
    }
});

// Get all registrations with populated data
router.get('/registrations', protect, authorize('superadmin'), async (req, res) => {
    try {
        const regs = await Registration.find()
            .populate('userId', 'name email')
            .populate('eventId', 'title date');
            
        const allRegs = regs.map(r => ({
            _id: r._id,
            userName: r.userId?.name || 'Unknown',
            eventName: r.eventId?.title || 'Deleted Event',
            eventDate: r.eventId?.date || null
        }));
        
        res.json(allRegs);
    } catch (error) {
        console.error('Regs error:', error);
        res.status(500).json({ message: 'Server error fetching registrations' });
    }
});

module.exports = router;
