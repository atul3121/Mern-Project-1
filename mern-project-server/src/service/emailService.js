
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendMail = async (to, subject, body) => {
    const emailOptions = {
        from: process.env.GMAIL_EMAIL_ID,
        to,
        subject,
        text: body
    };

    try {
        await transporter.sendMail(emailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error;
    }
};

module.exports = { sendMail };
