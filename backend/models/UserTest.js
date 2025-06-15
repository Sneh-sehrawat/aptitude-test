const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  selectedOption: String,
  isCorrect: Boolean,
  section: String
});

const UserTestSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  answers: [AnswerSchema],
  sectionScores: {
    English: Number,
    MathsReasoning: Number,
    Aptitude: Number,
    totalScore: Number      // ✅ This is now correctly included
  },
  submittedAt: {
    type: Date,
    default: Date.now       // ✅ This ensures Mongo auto-sets submission date
  }
});

module.exports = mongoose.model('UserTest', UserTestSchema);
