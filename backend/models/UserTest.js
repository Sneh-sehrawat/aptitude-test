const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  selectedOption: String,
  isCorrect: Boolean,
  section: String
});

const UserTestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneno: { type: String },    // 👈 add if missing
  company: { type: String },    // 👈 add if missing
  college: { type: String },
  stream: { type: String },  // 👈 add if missing
  enrollment: { type: String },
  highmarks:{type:String},
  intermarks:{type:String},
  cgpa:{type:String},  // 👈 add if missing
  type: {type:String},    // 👈 add if missing
  sectionScores: {
    English: Number,
    MathsReasoning: Number,
    Aptitude: Number,
    computerFundamentals: Number,
    totalScore: Number
  },
  timeTaken: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserTest', UserTestSchema);
