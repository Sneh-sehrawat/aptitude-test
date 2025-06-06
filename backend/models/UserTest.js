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
    Aptitude: Number
  },
  totalScore: Number,
  submittedAt: Date
});

module.exports = mongoose.model('UserTest', UserTestSchema);
