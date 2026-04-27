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

router.get('/results/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const results = await UserTest.find({
      submittedAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results by date:', error);
    res.status(500).json({ message: 'Failed to fetch results by date' });
  }
});

module.exports = router;