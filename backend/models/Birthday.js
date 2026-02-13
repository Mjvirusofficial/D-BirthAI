const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    whatsapp: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Family', 'GF', 'BF', 'Friends', 'Work', 'Teacher']
    },
    relationship: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ''
    },
    reminder: {
        type: Boolean,
        default: true
    },
    reminderTime: {
        type: String,
        default: '09:00'
    },
    reminderDays: {
        type: String,
        default: '1'
    },
    amPm: {
        type: String,
        enum: ['AM', 'PM'],
        default: 'AM'
    },
    bio: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Birthday', birthdaySchema);
