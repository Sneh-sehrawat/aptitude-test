const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  section: String,
  questionText: String,
  options: [String],
  correctAnswer: String
});

module.exports = mongoose.model('Question', questionSchema);

