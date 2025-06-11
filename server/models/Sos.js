const mongoose = require('mongoose');

const SosSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
},
  {timestamps:true
});

module.exports = mongoose.model('sos', SosSchema);