const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load env variables
require('dotenv').config();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, company } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      company
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route for users and admin
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  // Admin login
  if (role === 'admin') {
    if (email === 'admin@example.com' && password === 'Adm!n@2025$ecure') {
      // Token without expiry
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET);
      return res.json({ success: true, role: 'admin', token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  }

  // User login
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid password' });

    // Token without expiry
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      role: 'user',
      token,
      name: user.name,
      email: user.email,
      company: user.company,
      user: {
        name: user.name,
        email: user.email,
        company: user.company
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
