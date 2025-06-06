const express = require('express');
const UserTest = require('../models/UserTest');

const router = express.Router();

router.get('/results', async (req, res) => {
  try {
    const results = await UserTest.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
});

module.exports = router;
