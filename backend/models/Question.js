const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  section: String,
  questionText: String,
  options: [String],
  correctAnswer: String,
  hint: String,
  type: { type: String, enum: ["quiz", "mock"], default: "quiz" } // 👈 new field
});

module.exports = mongoose.model("Question", QuestionSchema);

