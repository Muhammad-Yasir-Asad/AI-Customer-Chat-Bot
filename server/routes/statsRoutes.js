const express = require('express');
const Chat = require('../models/Chat');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Route to get statistics for the dashboard
router.get('/', async (req, res) => {
  try {
    // Get the total number of messages
    const totalMessages = await Chat.countDocuments();

    // Get the sentiment breakdown
    const sentimentStats = await Chat.aggregate([
      { $group: { _id: "$sentiment", count: { $sum: 1 } } }
    ]);
    const sentimentData = {
      positiveSentiment: sentimentStats.find(s => s._id === 'Positive')?.count || 0,
      neutralSentiment: sentimentStats.find(s => s._id === 'Neutral')?.count || 0,
      negativeSentiment: sentimentStats.find(s => s._id === 'Negative')?.count || 0,
    };

    // Get the most frequent intent
    const intentStats = await Chat.aggregate([
      { $group: { _id: "$intent", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostFrequentIntent = intentStats[0]?._id || 'None';

    // Get recent chats (latest 5)
    const recentChats = await Chat.find().sort({ timestamp: -1 }).limit(5).select('message timestamp');

    // Get feedback stats
    const feedbackStats = await Feedback.aggregate([
      { $group: { _id: "$feedback", count: { $sum: 1 } } }
    ]);
    const feedbackData = {
      positiveFeedback: feedbackStats.find(f => f._id === 'positive')?.count || 0,
      negativeFeedback: feedbackStats.find(f => f._id === 'negative')?.count || 0,
    };

    // Return the stats
    res.json({
      totalMessages,
      ...sentimentData,
      mostFrequentIntent,
      recentChats,
      ...feedbackData,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

module.exports = router;
