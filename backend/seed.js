const mongoose = require('mongoose');
const Question = require('./models/Question');
const questions = require('./data.json');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Question.deleteMany();               // Clears old questions
    await Question.insertMany(questions);      // Loads from data.json
    console.log("✅ Questions seeded to MongoDB");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  });
