const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  name: String,
  habits: String,
  lifestyle: String,
  score: Number,
  challengeJoined: {
    type: Boolean,
    default: false
  },
  challengeName: String,
  challengeGoal: Number
});

module.exports = mongoose.model('Entry', EntrySchema);