// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/emergency-contacts/:userId
// @desc    Save or update emergency contacts for a user
// @access  Private (ensure auth middleware if needed)
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const contacts = req.body;

  if (!Array.isArray(contacts)) {
    return res.status(400).json({ message: 'Invalid contact data format. Expected an array.' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { emergencyContacts: contacts },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Emergency contacts updated successfully',
      emergencyContacts: user.emergencyContacts,
    });
  } catch (error) {
    console.error('Error saving contacts:', error.message);
    res.status(500).json({ message: 'Server error saving contacts' });
  }
});

// @route   GET /api/emergency-contacts/:userId
// @desc    Get emergency contacts for a user
// @access  Private (ensure auth middleware if needed)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('emergencyContacts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.emergencyContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
});

// @route   DELETE /api/emergency-contacts/:contactId
// @desc    Delete a specific contact (advanced optional route)
// @note    This assumes emergency contacts are stored with _id in subdocument
//          If not using subdocument IDs, this will require index-based deletion
router.delete('/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.emergencyContacts = user.emergencyContacts.filter(
      (contact) => contact._id.toString() !== contactId
    );

    await user.save();

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    res.status(500).json({ message: 'Server error deleting contact' });
  }
});

module.exports = router;