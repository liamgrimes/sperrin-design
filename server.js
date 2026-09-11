const express = require('express');
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

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and message are required.'
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});