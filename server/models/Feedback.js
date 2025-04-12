const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  message: String,
  feedback: { type: String, enum: ['positive', 'negative'] },
  timestamp: Date
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

