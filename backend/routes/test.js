const express = require('express');
const router = express.Router();
const UserTest = require('../models/UserTest');
const verifyToken = require('../middleware/verifyToken'); // Correct path

// POST /submit-test with token verification
router.post('/submit-test', verifyToken, async (req, res) => {
  try {
    console.log("📥 Received result submission:", req.body);

    // userId is attached on req by verifyToken middleware
    const userId = req.userId;

    const { score, timeTaken } = req.body;

    // Validate essential score field
    if (!score) {
      return res.status(400).json({ error: 'Missing score data.' });
    }

    // Create new test result linked to userId
    const newResult = new UserTest({
      userId,
      score: score.total,
      sectionScores: {
        English: score.English,
        MathsReasoning: score.MathsReasoning,
        Aptitude: score.Aptitude,
      },
      timeTaken: timeTaken || '',
      createdAt: new Date(),
    });

    await newResult.save();

    console.log("✅ Result saved successfully!");
    res.status(201).json({ message: 'Result saved successfully!' });
  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

module.exports = router;
