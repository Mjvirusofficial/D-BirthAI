const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Debug logging to verify environment variables are loaded
    console.log('--- Email Debug Info ---');
    console.log('EMAIL_USERNAME present:', !!process.env.EMAIL_USERNAME, 'Length:', process.env.EMAIL_USERNAME ? process.env.EMAIL_USERNAME.length : 0);
    console.log('EMAIL_PASSWORD present:', !!process.env.EMAIL_PASSWORD, 'Length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);

    // Check if credentials exist to avoid crash
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        console.warn('EMAIL_USERNAME or EMAIL_PASSWORD not set in .env');
        console.warn('Simulating email send for:', options.email);
        console.log('Subject:', options.subject);
        console.log('Message:', options.message);
        return; // Early return to prevent crash
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        logger: true,
        debug: true
    });

    const mailOptions = {
        from: `D-BirthAI <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        console.log('------------------------');
    } catch (error) {
        console.error('Error sending email:', error);
        console.log('------------------------');
        throw error;
    }
};

module.exports = sendEmail;
