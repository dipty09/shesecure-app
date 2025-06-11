const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    required: true,
  }
}, { _id: false }); // Optional: Prevents creating an _id for each contact if not needed

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { 
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emergencyContacts: [emergencyContactSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);