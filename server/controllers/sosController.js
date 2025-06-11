const SOSAlert = require('../models/Sos');

// POST /api/sos/send-alert
const createSosAlert = async (req, res) => {
  const { userId, location } = req.body;

  if (!userId || !location) {
    return res.status(400).json({ message: 'userId and location are required' });
  }

  try {
    const newAlert = new SOSAlert({
      userId,
      location,
      timestamp: new Date(),
    });

    await newAlert.save();
    res.status(201).json({ message: 'SOS alert created successfully', alert: newAlert });
  } catch (error) {
    console.error('Error creating SOS alert:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/sos/user-alerts/:userId
const getSosAlertsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const alerts = await SOSAlert.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching SOS alerts:', error);
    res.status(500).json({ message: 'Failed to fetch SOS alerts' });
  }
};
module.exports = {
  createSosAlert,
  getSosAlertsByUser,
};