const express = require('express');
const path = require('path');
require('dotenv').config();
const { sendEmail } = require('./src/server/email');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));



app.get('/', (req, res) => {
  res.status(200).send('Sperrin Design API is running.');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/api/recaptcha-config', (req, res) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  const allowedOrigins = (process.env.CONTACT_FORM_ALLOWED_ORIGINS || 'https://sperrindesign.com')
    .split(',')
    .map((origin) => origin.trim());
  const requestOrigin = req.get('Origin');

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.set('Access-Control-Allow-Origin', requestOrigin);
    res.vary('Origin');
  }

  if (!siteKey) {
    return res.status(503).json({
      success: false,
      message: 'Contact form spam protection is not configured.'
    });
  }

  return res.json({ siteKey });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const recaptchaResponse = req.body['g-recaptcha-response'];

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and message are required.'
    });
  }

  if (!recaptchaResponse) {
    return res.status(400).json({
      success: false,
      message: 'Please complete the reCAPTCHA challenge.'
    });
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!recaptchaSecret) {
    return res.status(503).json({
      success: false,
      message: 'Contact form spam protection is not configured.'
    });
  }

  let captchaResult;
  try {
    const verification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: recaptchaSecret,
        response: recaptchaResponse
      }),
      signal: AbortSignal.timeout(10_000)
    });

    if (!verification.ok) {
      throw new Error(`reCAPTCHA verification returned HTTP ${verification.status}`);
    }

    captchaResult = await verification.json();
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return res.status(502).json({
      success: false,
      message: 'Spam protection could not be verified. Please try again.'
    });
  }

  const allowedHostname = process.env.RECAPTCHA_ALLOWED_HOSTNAME;
  if (
    !captchaResult.success ||
    (allowedHostname && captchaResult.hostname !== allowedHostname)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please complete the reCAPTCHA challenge.'
    });
  }

  const recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL;

  if (!recipient) {
    return res.status(500).json({
      success: false,
      message: 'Email service is not configured.'
    });
  }

  try {
    await sendEmail({
      to: recipient,
      replyTo: email,
      subject: 'Sperrin Design contact form',
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `
    });

  return res.redirect('https://sperrindesign.com/contact.html?sent=1');

  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while sending the email.'
    });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'compliance-pages', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});