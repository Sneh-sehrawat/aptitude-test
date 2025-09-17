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
router.get("/full", async (req, res) => {
  const quizQuestions = await Question.find({ type: "quiz" });
  res.json(quizQuestions);
});

// Get all mock questions
router.get("/mock/full", async (req, res) => {
  const mockQuestions = await Question.find({ type: "mock" });
  res.json(mockQuestions);
});
router.post("/", async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ all questions (no filter, all quiz + mock)
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ one question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE question by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Question not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE question by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
