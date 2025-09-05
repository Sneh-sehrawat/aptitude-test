const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// ✅ Route to generate question set without correctAnswer
router.get('/generate-set', async (req, res) => {
  try {
    console.log("✅ [Backend] Request received for /generate-set");

    const english = await Question.aggregate([
      { $match: { section: 'English' } },
      { $sample: { size: 10 } },
      {
        $project: {
          _id: 1,
          section: 1,
          questionText: 1,
          options: 1,
          
          hint: 1
        }
      }
    ]);

    const maths = await Question.aggregate([
      { $match: { section: 'MathsReasoning' } },
      { $sample: { size: 20 } },
      {
        $project: {
          _id: 1,
          section: 1,
          questionText: 1,
          options: 1,
          hint: 1
        }
      }
    ]);

    const aptitude = await Question.aggregate([
      { $match: { section: 'Aptitude' } },
      { $sample: { size: 20 } },
      {
        $project: {
          _id: 1,
          section: 1,
          questionText: 1,
          options: 1,
          hint: 1
        }
      }
    ]);

    console.log(`✅ Questions fetched: English=${english.length}, Maths=${maths.length}, Aptitude=${aptitude.length}`);

    res.json([...english, ...maths, ...aptitude]);
  } catch (err) {
    console.error("❌ [Backend] Error fetching questions:");
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to generate question set', message: err.message });
  }
});

// ✅ New Route: get all questions with correctAnswer for scoring/review
router.get('/full', async (req, res) => {
  try {
    const questions = await Question.find({}, '-__v'); // exclude __v field
    res.json(questions); // includes hint + correctAnswer
  } catch (err) {
    console.error('❌ Error fetching full questions:', err);
    res.status(500).json({ message: 'Server error fetching full questions' });
  }
});

module.exports = router;
