// server/routes/mail.js
// Defines the /api/send-mail endpoint

const express = require('express');
const router = express.Router();

const { sendContactMail } = require('../controllers/mailController');

router.post('/send-mail', sendContactMail);

module.exports = router;
