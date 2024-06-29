// src/models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['login', 'signup'],
    required: true
  },
  username: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);
