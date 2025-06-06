const express = require('express');
const router = express.Router();
const UserTest = require('../models/UserTest');
const verifyToken = require('../middleware/verifyToken');

// Route to start test and save startTime
router.post('/start-test', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Save a new test document with startTime as now
    const newTest = new UserTest({
      userId,
      startTime: new Date(),
      submittedAt: null,  // Not submitted yet
    });

    await newTest.save();

    res.status(201).json({ message: 'Test started', testId: newTest._id, startTime: newTest.startTime });
  } catch (err) {
    console.error("❌ Error starting test:", err);
    res.status(500).json({ error: 'Failed to start test' });
  }
});

// Route to submit test result
router.post('/submit-test', verifyToken, async (req, res) => {
  try {
    console.log("📥 Received result submission:", req.body);

    const userId = req.userId;
    const { name, email, company, sectionScores, totalScore, testId } = req.body;

    if (!sectionScores || totalScore === undefined || !testId) {
      return res.status(400).json({ error: 'Missing score data or test ID.' });
    }

    // Find the test started earlier using testId
    const test = await UserTest.findById(testId);
    if (!test) return res.status(404).json({ error: 'Test record not found' });

    if (test.submittedAt) {
      return res.status(400).json({ error: 'Test already submitted' });
    }

    const submittedAt = new Date();

    // Calculate timeTaken in seconds (submittedAt - startTime)
    const timeTakenMs = submittedAt - test.startTime;
    const timeTakenSeconds = Math.floor(timeTakenMs / 1000);

    // Update the test document with scores, time taken, and submission time
    test.name = name;
    test.email = email;
    test.company = company;
    test.sectionScores = sectionScores;
    test.totalScore = totalScore;
    test.timeTaken = timeTakenSeconds;  // Save seconds
    test.submittedAt = submittedAt;

    await test.save();

    console.log("✅ Result saved successfully!");
    res.status(201).json({ message: 'Result saved successfully!', timeTakenSeconds });
  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

module.exports = router;
