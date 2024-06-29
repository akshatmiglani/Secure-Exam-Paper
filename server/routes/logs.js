// src/routes/logs.js
const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// Get all logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

module.exports = router;
