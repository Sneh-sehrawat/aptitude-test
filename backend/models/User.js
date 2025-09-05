const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },        // better to make required
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },    // required since signup hashes password
  company: { type: String },
  phoneno: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);