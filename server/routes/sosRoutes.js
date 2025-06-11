require('dotenv').config();
const express = require('express');
const router = express.Router();
const Sos = require('../models/Sos');
const User = require('../models/User');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const { createSosAlert, getSosAlertsByUser } = require('../controllers/sosController');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Enhanced SOS route with image attachment
router.post('/send', async (req, res) => {
  console.log("🔔 Received SOS request:", req.body);

  const { userId, location, image } = req.body;

  if (!userId || !location) {
    return res.status(400).json({ message: '❌ userId and location are required' });
  }

  const googleMapLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
 const sheSecureLink = `https://shesecure.app/live-location/${userId}`;

  try {
    console.log("📦 Saving SOS alert to DB...");
    const newSos = new Sos({ userId, location });
    await newSos.save();

    console.log("🔍 Fetching user by ID:", userId);
    const user = await User.findById(userId);

    if (!user || !Array.isArray(user.emergencyContacts) || user.emergencyContacts.length === 0) {
      return res.status(404).json({ message: '❌ Emergency contacts not found' });
    }

    const smsMessage = `🚨 SOS Alert from ${user.name} (via SheSecure App)!\n📍 Google Maps: ${googleMapLink}\n🔗 Live Tracking: ${sheSecureLink}`;
    const emailSubject = `🚨 Emergency SOS Alert from ${user.name} via SheSecure`;

    const emailHtml = `
      <p><strong>${user.name}</strong> has triggered an <strong>SOS alert</strong> via <strong>SheSecure</strong>.</p>
      <p><strong>📍 Google Maps:</strong> <a href="${googleMapLink}">${googleMapLink}</a></p>
      <p><strong>🔗 Live Tracking:</strong> <a href="${sheSecureLink}">${sheSecureLink}</a></p>
      ${image ? `<p><strong>📸 Attached image from front camera:</strong> (see below)</p>` : ''}
    `;

    let smsSent = 0, emailSent = 0;

    for (const contact of user.emergencyContacts) {
      if (contact.phone) {
        try {
          console.log("📲 Sending SMS to:", contact.phone);
          await twilioClient.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: contact.phone,
          });
          smsSent++;
        } catch (smsError) {
          console.error(`❌ Failed to send SMS to ${contact.phone}:`, smsError.message);
        }
      }
    

      if (contact.email) {
        try {
          console.log("📧 Sending Email to:", contact.email);
          await transporter.sendMail({
            from: `"Women Safety App" <${process.env.EMAIL_USER}>`,
            to: contact.email,
            subject: emailSubject,
            html: emailHtml,
            attachments: image
              ? [{
                  filename: 'sos_photo.png',
                  content: image.split("base64,")[1],
                  encoding: 'base64',
                }]
              : [],
          });
          emailSent++;
        } catch (emailError) {
          console.error(`❌ Failed to send Email to ${contact.email}:`, emailError.message);
        }
      }
    }

    const resultMessage = `✅ SOS alert sent. SMS: ${smsSent}, Email: ${emailSent}`;
    console.log(resultMessage);
    res.status(200).json({ message: resultMessage });

  } catch (error) {
    console.error('❌ SOS Alert Critical Error:', error);
    res.status(500).json({ message: 'Failed to send SOS alerts', error: error.message });
  }
});

// Other existing routes (unchanged)
router.post('/send-alert', createSosAlert);
router.get('/user-alerts/:userId', getSosAlertsByUser);

module.exports = router;