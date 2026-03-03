require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const birthdayRoutes = require('./routes/birthdays');
const Birthday = require('./models/Birthday');
const { sendWhatsAppMessage } = require('./utils/whatsapp');
const { adminWish, userReminderWhatsApp } = require('./utils/messageTemplates');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Root Route - Health Check
app.get('/', (req, res) => {
    res.send('D-BirthAI Backend is Running 🚀');
});

// Serve WhatsApp QR
app.use('/qr.png', express.static('qr.png'));

// Routes
app.use('/api/birthdays', birthdayRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- SMART EVERY MINUTE WISH SYSTEM ---
let sentBirthdaysToday = new Set(); // To track sent wishes in memory
let lastResetDateString = new Date().toDateString();

// Helper function for delay (Anti-Ban)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Lock mechanism to prevent overlapping jobs
let isJobRunning = false;

// Cron Job: Runs every minute to check for birthdays matching the current time
cron.schedule('* * * * *', async () => {
    // Daily Reset: Clear the memory list at midnight (or first run of the day)
    const currentToday = new Date().toDateString();
    if (currentToday !== lastResetDateString) {
        sentBirthdaysToday.clear();
        lastResetDateString = currentToday;
        console.log('[SYSTEM] Daily Sent List cleared for the new day. 🔄');
    }

    if (isJobRunning) return;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDate = now.getDate();

    // Format current time to match DB format (e.g., "09:00 AM")
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const currentFormattedTime = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    console.log(`[CRON] ${now.toLocaleTimeString()} - Checking for birthdays at ${currentFormattedTime} ${ampm}...`);

    try {
        isJobRunning = true;

        // Find birthdays matching TODAY, matching CURRENT TIME, matching AM/PM, and NOT already sent
        const birthdays = await Birthday.find({
            reminder: true,
            _id: { $nin: Array.from(sentBirthdaysToday) },
            reminderTime: currentFormattedTime,
            amPm: ampm,
            $expr: {
                $and: [
                    { $eq: [{ $month: "$date" }, currentMonth] },
                    { $eq: [{ $dayOfMonth: "$date" }, currentDate] }
                ]
            }
        }).populate('userId');

        if (birthdays.length > 0) {
            console.log(`[CRON] Found ${birthdays.length} matches! Delivering wishes...`);

            for (const birthday of birthdays) {
                // Secondary check for memory list
                if (sentBirthdaysToday.has(birthday._id.toString())) continue;

                const senderName = birthday.userId ? birthday.userId.name : 'A friend';
                const senderNumber = (birthday.userId && birthday.userId.whatsappNumber) ? birthday.userId.whatsappNumber : 'D-BirthAI';

                const wishMessage = adminWish(senderName, senderNumber, birthday.name);
                console.log(`[AUTOMATION] Sending wish to ${birthday.name} at ${birthday.reminderTime} ${birthday.amPm}...`);

                const success = await sendWhatsAppMessage(birthday.whatsapp, wishMessage);

                if (success) {
                    console.log(`[SUCCESS] Wish sent to ${birthday.name} ✅`);
                    sentBirthdaysToday.add(birthday._id.toString()); // Mark as sent in memory

                    // Notify the USER
                    if (birthday.userId && birthday.userId.whatsappNumber) {
                        const userNotifyMessage = userReminderWhatsApp(birthday.userId.name, birthday.name);
                        await sendWhatsAppMessage(birthday.userId.whatsappNumber, userNotifyMessage);
                    }
                } else {
                    console.log(`[FAILED] Could not send wish to ${birthday.name} ❌`);
                }

                // Random delay (3-8 seconds)
                const randomDelay = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
                await sleep(randomDelay);
            }
            console.log('[CRON] Minute-batch processing complete. ✅');
        }

        isJobRunning = false;
    } catch (error) {
        console.error('CRON ERROR:', error);
        isJobRunning = false;
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - Smart BirthAI Active 🚀`);
});
