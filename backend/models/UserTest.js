const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  selectedOption: String,
  isCorrect: Boolean,
  section: String
});

const UserTestSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // User ka ID
  name: { type: String, required: true },    // User ka naam
  email: { type: String, required: true },   // User ka email
  company: { type: String, required: true }, // User ki company

  // ✅ Section-wise scores
  sectionScores: {
    English: { type: Number, default: 0 },
    MathsReasoning: { type: Number, default: 0 },
    Aptitude: { type: Number, default: 0 }
  },

  totalScore: { type: Number, default: 0 },   // ✅ Total score
  result: { type: String, default: "" },      // ✅ Passed/Failed

  answers: [AnswerSchema],                    // ✅ Array of answers

  timeTaken: { type: String, default: "" },   // ✅ Duration
  submittedAt: {
    type: Date,
    default: Date.now                         // ✅ Timestamp
  }
});

module.exports = mongoose.model('UserTest', UserTestSchema);
