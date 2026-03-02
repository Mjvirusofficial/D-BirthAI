const generateWhatsAppLink = (number, message) => {
    // Ensure number has country code (default to 91 if missing and 10 digits)
    let formattedNumber = number.replace(/\D/g, '');
    if (formattedNumber.length === 10) {
        formattedNumber = '91' + formattedNumber;
    }
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
};

module.exports = {
    adminWish: (userName, birthdayName) => `Happy Birthday ${birthdayName}! 🎂\n\n${userName} has scheduled this special surprise for you via D-BirthAI.\nHave a great year ahead! 🎉`,

    userReminderEmail: (userName, birthdayName, link) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h1 style="color: #ff9800; text-align: center;">🎉 It's ${birthdayName}'s Birthday Today! 🎂</h1>
            <p style="font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
            <p style="font-size: 16px; color: #555;">Today is a special day! Don't forget to wish your loved one.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                <p style="margin: 0; color: #666; font-style: italic;">
                    "We have already sent a scheduled wish from D-BirthAI on your behalf! ✅"
                </p>
            </div>

            <p style="font-size: 16px; color: #555;">Now it's your turn to make it personal. Click below to send a message instantly:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #25D366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    Click to Wish on WhatsApp 📲
                </a>
            </div>

            <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
                Powered by <strong>D-BirthAI</strong><br>
                <em>Never Miss Any Birthday</em>
            </p>
        </div>
    `,

    userReminderWhatsApp: (userName, birthdayName, link) => `Hey ${userName}! 👋\n\n🎉 It's *${birthdayName}'s* Birthday Today! 🎂\n\n✅ We have already sent a scheduled wish on your behalf.\n\nNow it's your turn! Click below to wish them personally: 👇\n${link}\n\n_Powered by D-BirthAI_`,

    generateWhatsAppLink
};
