// routes/userRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify token and role
const verifyTokenAndRole = (roles) => (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Access denied: Invalid role' });
    }

    req.user = decoded;
    next();
  });
};

// Admin panel route
router.get('/admin', verifyTokenAndRole(['admin']), async (req, res) => {
  res.json({ message: 'Welcome to the admin panel' });
});

// Examiner panel route
router.get('/examiner', verifyTokenAndRole(['examiner']), async (req, res) => {
  res.json({ message: 'Welcome to the examiner panel' });
});

// Invigilator panel route
router.get('/invigilator', verifyTokenAndRole(['invigilator']), async (req, res) => {
  res.json({ message: 'Welcome to the invigilator panel' });
});

module.exports = router;
