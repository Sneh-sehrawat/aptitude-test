const express = require('express');
const router = express.Router();
const UserTest = require('../models/UserTest');
const User = require('../models/User');   //  Import your User model
const verifyToken = require('../middleware/verifyToken');

// POST /submit-test with token verification
router.post('/submit-test', verifyToken, async (req, res) => {
  try {
    console.log("📥 Received result submission:", req.body);

    const userId = req.userId;
    const { score, timeTaken, phoneno,college } = req.body; //  phoneno comes from form

    if (!score || typeof score.total !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid score data.' });
    }

    // Fetch name and email from User collection (signup data)
    const user = await User.findById(userId).select("name email company phoneno");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newResult = new UserTest({
      userId,
      name: user.name,       // always reliable
      email: user.email,     //  always reliable
      phoneno: user.phoneno,              //  from form
      company:user.company,               // from form
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

