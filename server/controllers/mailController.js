// server/controllers/mailController.js
// Handles incoming contact form submissions and triggers emails

const { sendMail } = require('../utils/sendMail');

// Basic email regex for simple validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.sendContactMail = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body || {};

    const errors = {};

    if (!fullName || !fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!email || !email.trim()) {
      errors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please provide a valid email address';
    }

    if (!phone || !phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!subject || !subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!message || !message.trim()) {
      errors.message = 'Message is required';
    }

    // If any validation errors, return 400
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    const receiverEmail = process.env.RECEIVER_EMAIL;

    if (!receiverEmail) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: RECEIVER_EMAIL is not set',
      });
    }

    // Format email content
    const companySubject = 'New Enquiry From Website';
    const companyText = `New enquiry from website\n\nFull Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage:\n${message}`;

    const companyHtml = `
      <h2>New Enquiry From Website</h2>
      <p>You received a new enquiry from your website contact form:</p>
      <table cellpadding="4" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr><td><strong>Full Name:</strong></td><td>${fullName}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Subject:</strong></td><td>${subject}</td></tr>
        <tr><td valign="top"><strong>Message:</strong></td><td>${message.replace(/\n/g, '<br>')}</td></tr>
      </table>
    `;

    const clientSubject = 'Thanks for contacting us';
    const clientText = `Hi ${fullName},\n\nThank you for contacting us. We received your message and will get back shortly.\n\nBest regards,\nNiket Raj`;
    const clientHtml = `
      <p>Hi ${fullName},</p>
      <p>Thank you for contacting us. We received your message and will get back shortly.</p>
      <p>Best regards,<br/>Niket Raj</p>
    `;

    // Send emails sequentially to keep error handling simple
    await sendMail({
      to: receiverEmail,
      subject: companySubject,
      text: companyText,
      html: companyHtml,
    });

    await sendMail({
      to: email,
      subject: clientSubject,
      text: clientText,
      html: clientHtml,
    });

    return res.json({
      success: true,
      message: 'Mail sent successfully',
    });
  } catch (err) {
    console.error('Error sending contact mail:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
    });
  }
};
