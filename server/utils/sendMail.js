// server/utils/sendMail.js
// Centralized Nodemailer utility for sending emails via SMTP (Mailtrap, Gmail, Brevo, etc.)

const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

// Ensure env is loaded when this module is required (in case index.js hasn't loaded it yet)
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SENDER_EMAIL,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
  console.warn(
    'Warning: SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD in your .env file.'
  );
}

// Create a reusable transporter object using the SMTP transport
// NOTE: For Gmail, you MUST use an App Password (not your regular password)
// Steps to create Gmail App Password:
// 1. Enable 2-Factor Authentication on your Google Account
// 2. Go to https://myaccount.google.com/apppasswords
// 3. Generate an App Password for "Mail" and use that as SMTP_PASSWORD
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false, // use STARTTLS on port 587 (use secure: true for port 465)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  // Add connection timeout and retry logic
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

// Verify transporter configuration (run once on startup)
// This will catch authentication errors early
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD) {
  transporter.verify(function (error, success) {
    if (error) {
      console.error('SMTP Configuration Error:', error.message);
      if (error.code === 'EAUTH') {
        console.error('\n=== GMAIL AUTHENTICATION ERROR ===');
        console.error('Gmail authentication failed. Common causes:');
        console.error('1. Using regular password instead of App Password');
        console.error('2. App Password not generated or expired');
        console.error('3. 2-Factor Authentication not enabled');
        console.error('\nSolution:');
        console.error('1. Enable 2-Factor Authentication: https://myaccount.google.com/security');
        console.error('2. Generate App Password: https://myaccount.google.com/apppasswords');
        console.error('3. Use the 16-character App Password as SMTP_PASSWORD in your .env file');
        console.error('===================================\n');
      }
    } else {
      console.log('✓ SMTP server is ready to send emails');
    }
  });
}

/**
 * Send an email using the shared transporter.
 * @param {Object} options
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text version of the email.
 * @param {string} options.html - HTML version of the email.
 */
async function sendMail({ to, subject, text, html }) {
  const fromAddress = SENDER_EMAIL || SMTP_USER;

  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
