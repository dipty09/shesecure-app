const express = require('express');
const router = express.Router();
const LiveLocation = require('../models/LiveLocation');

// POST: Update live location
router.post('/update', async (req, res) => {
  const { userId, location } = req.body;

  if (!userId || !location) {
    return res.status(400).json({ message: 'userId and location required' });
  }

  try {
    await LiveLocation.create({
      userId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date(),
    });

    res.status(200).json({ message: 'Live location updated' });
  } catch (error) {
    console.error('Error saving live location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET: Fetch latest location for a user
router.get('/latest/:userId', async (req, res) => {
  try {
    const location = await LiveLocation.findOne({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Failed to retrieve location' });
  }
});

module.exports = router;