const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  section: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  hint: { type: String } 
});

module.exports = mongoose.model('Question', questionSchema);
