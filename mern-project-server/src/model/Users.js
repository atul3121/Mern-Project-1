const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:     { type: String } // Optional: add name if you want to store it
});

module.exports = mongoose.model('User', userSchema);
