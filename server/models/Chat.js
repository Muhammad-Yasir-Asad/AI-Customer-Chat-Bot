// models/Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  message: String,
  messageInEnglish: String,
  detectedLanguage: String,
  intent: String,
  sentiment: String,
  faq: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", ChatSchema);
