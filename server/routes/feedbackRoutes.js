const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
  try {
    const { message, feedback, timestamp } = req.body;

    const newFeedback = new Feedback({
      message,
      feedback,
      timestamp
    });

    await newFeedback.save();
    res.status(200).json({ message: 'Feedback saved successfully' });
  } catch (err) {
    console.error("Feedback save error:", err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

module.exports = router;
