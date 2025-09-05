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
    const { name, email, password, company,phoneno } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      company,
      phoneno
      
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
  console.log("🛰️ Incoming login request body:", req.body);


  // Admin login
  if (role === 'admin') {
     
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Use secret from env file
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
console.log("🧾 LOGIN: Signing token with secret:", process.env.JWT_SECRET);

    // Generate JWT token using secret from env
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with token and user info
    res.json({
      success: true,
      role: 'user',
      token,
      name: user.name,
      email: user.email,
      company: user.company,
      phoneno: user.phoneno,
      user: {
        name: user.name,
        email: user.email,
        company: user.company,
        phoneno: user.phoneno,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;