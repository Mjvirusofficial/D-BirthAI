const express = require('express');
const router = express.Router();
const Birthday = require('../models/Birthday');
const auth = require('../middleware/auth');

// GET all birthdays for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const birthdays = await Birthday.find({ userId: req.userId }).sort({ date: 1 });
        res.json(birthdays);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ADD a new birthday
router.post('/', auth, async (req, res) => {
    const {
        name,
        whatsapp,
        date,
        category,
        relationship,
        photo,
        reminder,
        reminderTime,
        reminderDays,
        amPm,
        bio,
        instagram
    } = req.body;

    const newBirthday = new Birthday({
        userId: req.userId,
        name,
        whatsapp,
        date,
        category,
        relationship,
        photo: photo || '',
        reminder,
        reminderTime,
        reminderDays,
        amPm,
        bio: bio || '',
        instagram: instagram || ''
    });

    try {
        const savedBirthday = await newBirthday.save();
        res.status(201).json(savedBirthday);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a birthday
router.put('/:id', auth, async (req, res) => {
    try {
        const birthday = await Birthday.findOne({ _id: req.params.id, userId: req.userId });
        if (!birthday) return res.status(404).json({ message: 'Birthday not found' });

        const updatedBirthday = await Birthday.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedBirthday);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a birthday
router.delete('/:id', auth, async (req, res) => {
    try {
        const birthday = await Birthday.findOne({ _id: req.params.id, userId: req.userId });
        if (!birthday) return res.status(404).json({ message: 'Birthday not found' });

        await birthday.deleteOne();
        res.json({ message: 'Birthday deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
