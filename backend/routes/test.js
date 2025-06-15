const express = require('express');
const router = express.Router();
const UserTest = require('../models/UserTest');
const verifyToken = require('../middleware/verifyToken');

// POST /submit-test with token verification
router.post('/submit-test', verifyToken, async (req, res) => {
  try {
    console.log("📥 Received result submission:", req.body);

    const userId = req.userId;

    const { score, timeTaken, name, email, company } = req.body;

    if (!score || typeof score.total !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid score data.' });
    }

    const newResult = new UserTest({
      userId,
      name,
      email,
      company,
      sectionScores: {
        English: score.English || 0,
        MathsReasoning: score.MathsReasoning || 0,
        Aptitude: score.Aptitude || 0,
        totalScore: score.total
      },
      timeTaken: timeTaken || '',
      submittedAt: new Date()
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
