const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const path = require('path');

let whatsappStatus = 'initializing';
let lastQR = null;

// Initialize the WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
    }
});

// Event: Show QR code in terminal and save to file
client.on('qr', async (qr) => {
    whatsappStatus = 'qr_ready';
    lastQR = qr;
    console.log('--- SCAN THE QR CODE BELOW TO LOGIN ---');
    qrcode.generate(qr, { small: true });

    // Also save as image for easier scanning (Small size)
    try {
        const qrPath = path.join(__dirname, '..', 'qr.png');
        await QRCode.toFile(qrPath, qr, {
            width: 300,
            margin: 2
        });
        console.log(`QR Code also saved to: ${qrPath} 📄 (Size Reduced)`);
        console.log('Tip: Agar terminal mein scan nahi ho raha, toh folder mein "qr.png" ko khol kar scan karein.');
    } catch (err) {
        console.error('Failed to save QR code image:', err);
    }
});

// Event: Client is ready
client.on('ready', () => {
    whatsappStatus = 'connected';
    lastQR = null;
    console.log('WhatsApp Client is READY! ✅');
});

// Event: Authentication failed
client.on('auth_failure', (msg) => {
    whatsappStatus = 'auth_failure';
    console.error('WhatsApp Authentication Failed: ❌', msg);
});

// Event: Disconnected
client.on('disconnected', (reason) => {
    whatsappStatus = 'disconnected';
    console.log('WhatsApp Client Disconnected: ⚠️', reason);
    client.initialize(); // Try to re-initialize
});

// Function to get current status and QR
const getWhatsAppStatus = () => {
    return { status: whatsappStatus, qr: lastQR };
};

// Function to send WhatsApp message
const sendWhatsAppMessage = async (number, message) => {
    try {
        // Format number: Remove symbols and add country code if missing
        let formattedNumber = number.replace(/\D/g, '');
        if (formattedNumber.length === 10) {
            formattedNumber = '91' + formattedNumber;
        }

        // Add whatsapp suffix
        const chatId = formattedNumber + "@c.us";

        await client.sendMessage(chatId, message);
        console.log(`Message sent successfully to ${formattedNumber} ✅`);
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return false;
    }
};

// Initialize client
client.initialize();

module.exports = { client, sendWhatsAppMessage, getWhatsAppStatus };
