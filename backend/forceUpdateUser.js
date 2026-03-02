const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const forceUpdate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'deepakravidas565@gmail.com'; // Trying to update this user
        const testNumber = '9999999999';

        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { whatsappNumber: testNumber } },
            { new: true }
        );

        if (user) {
            console.log(`Successfully updated user ${user.name}`);
            console.log(`New WhatsApp Number: ${user.whatsappNumber}`);
        } else {
            console.log(`User with email ${email} not found.`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

forceUpdate();
