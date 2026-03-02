const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'name email whatsappNumber');
        console.log('\n--- User Data ---');
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            users.forEach(user => {
                console.log(`Name: ${user.name}`);
                console.log(`Email: ${user.email}`);
                console.log(`WhatsApp: '${user.whatsappNumber}'`); // Quoted to see empty strings
                console.log('-------------------');
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUsers();
