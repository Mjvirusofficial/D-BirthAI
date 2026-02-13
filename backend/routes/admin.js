const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Birthday = require('../models/Birthday');
const auth = require('../middleware/auth');

// @route   GET api/admin/users
// @desc    Get all users with their stats
// @access  Admin
router.get('/users', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        // Simple admin check: You can improve this logic later
        // For now, let's assume the first user or specific email is admin
        // Or strictly check the isAdmin flag
        if (!currentUser.isAdmin && currentUser.email !== 'hisaab204@gmail.com') { // Hardcoded admin email for easier setup
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        const users = await User.find().select('-password'); // Fetch users but exclude passwords for security? Actually user asked to see passwords.
        // If user explicitly asked to see passwords, we can include them, but they are hashed.
        // It's a bad practice to return passwords, even hashed. But fulfilling the user request:
        const usersWithPasswords = await User.find();

        const usersWithStats = await Promise.all(usersWithPasswords.map(async (user) => {
            const birthdayCount = await Birthday.countDocuments({ userId: user._id });
            return {
                ...user.toObject(),
                birthdayCount
            };
        }));

        res.json(usersWithStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/user/:id
// @desc    Delete user and their data
// @access  Admin
router.delete('/user/:id', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser.isAdmin && currentUser.email !== 'hisaab204@gmail.com') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await Birthday.deleteMany({ userId: user._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User and their data removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/user/:id/birthdays
// @desc    Get all birthdays added by a specific user
// @access  Admin
router.get('/user/:id/birthdays', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser.isAdmin && currentUser.email !== 'hisaab204@gmail.com') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        const birthdays = await Birthday.find({ userId: req.params.id }).sort({ date: 1 });
        res.json(birthdays);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
