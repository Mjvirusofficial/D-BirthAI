require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const birthdayRoutes = require('./routes/birthdays');
const Birthday = require('./models/Birthday');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/birthdays', birthdayRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Cron Job to Check Reminders (Runs every minute to check time)
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;

    // Get today's date parts
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    try {
        // Find birthdays matching today's date and current time for reminder
        const birthdays = await Birthday.find({
            reminder: true,
            reminderTime: currentTime,
            $expr: {
                $and: [
                    { $eq: [{ $month: "$date" }, currentMonth] },
                    { $eq: [{ $dayOfMonth: "$date" }, currentDay] }
                ]
            }
        });

        if (birthdays.length > 0) {
            console.log(`Found ${birthdays.length} reminders for ${currentTime}!`);
            birthdays.forEach(birthday => {
                // Here you would integrate WhatsApp API
                console.log(`[REMINDER] Send wish to ${birthday.name} on WhatsApp: ${birthday.whatsapp}`);
                // Example: sendWhatsApp(birthday.whatsapp, `Happy Birthday ${birthday.name}!`);
            });
        }
    } catch (error) {
        console.error('Error checking reminders:', error);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
