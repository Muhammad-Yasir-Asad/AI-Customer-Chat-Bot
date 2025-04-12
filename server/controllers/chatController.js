const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const googleTTS = require('google-tts-api');
const nodemailer = require('nodemailer'); // Add Nodemailer
const Chat = require('../models/Chat');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to detect language using Gemini
async function detectLanguageWithGemini(text) {
  const prompt = `Detect the language of the following message and respond with only the language code (e.g., "en", "es", "fr", "hi"): "${text}"`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const lang = (await result.response.text()).trim().replace(/["']/g, '');
  return lang;
}

// Function to translate using Gemini
async function translateWithGemini(text, sourceLang, targetLang) {
  if (sourceLang === targetLang) return text;

  const prompt = `Translate the following message from ${sourceLang} to ${targetLang}, and return only the translated sentence: "${text}"`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return (await result.response.text()).trim().replace(/["']/g, '');
}

async function sendManagerNotification(message, intent, sentiment) {
  // Set up nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your email password (or app-specific password)
    }
  });

  // Prepare the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.MANAGER_EMAIL,  // Manager's email address
    subject: 'Negative Sentiment Alert - Customer Message',
    text: `A customer message with negative sentiment was received. Here are the details:

Message: "${message}"
Intent: ${intent}
Sentiment: ${sentiment}
`
  };

  try {
    console.log('Attempting to send email...');
    await transporter.sendMail(mailOptions);
    console.log("Manager notified successfully.");
  } catch (error) {
    console.error("Error notifying manager:", error.message);
    throw error; // Re-throw error for further handling if needed
  }
}

// MAIN CHAT HANDLER
exports.handleChat = async (req, res) => {
  const { message } = req.body;
  try {
    // 1. Detect language of incoming message
    const originalLanguage = await detectLanguageWithGemini(message);
    console.log("Detected language:", originalLanguage);

    // 2. Translate to English if not already
    let messageInEnglish = message;
    if (originalLanguage !== 'en') {
      messageInEnglish = await translateWithGemini(message, originalLanguage, 'en');
    }

    // 3. Generate AI response
    const prompt = `
You are an AI customer support agent. Your task is:
1. Detect the intent: delivery, refund, product info, account issue.
2. Analyze sentiment: Positive, Neutral, or Negative.
3. Match with the closest FAQ.
4. Generate a polite, human-like response.
Query: "${messageInEnglish}"
Return format (strict raw JSON, no markdown formatting):
{
  "intent": "...",
  "sentiment": "...",
  "faq": "...",
  "response": "..."
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();

    // Clean JSON
    responseText = responseText.replace(/```json|```/g, '').trim();
    const jsonResponse = JSON.parse(responseText);

    // 4. Translate response to original language if needed
    let finalResponse = jsonResponse.response;
    if (originalLanguage !== 'en') {
      finalResponse = await translateWithGemini(jsonResponse.response, 'en', originalLanguage);
    }

    // 5. Generate TTS audio
    const audioUrls = await googleTTS.getAllAudioUrls(finalResponse, {
      lang: originalLanguage,
      slow: false,
      host: 'https://translate.google.com',
    });

    // 6. Save to MongoDB
    const chatLog = new Chat({
      message,
      messageInEnglish,
      detectedLanguage: originalLanguage,
      intent: jsonResponse.intent,
      sentiment: jsonResponse.sentiment,
      faq: jsonResponse.faq,
      response: finalResponse,
    });
    await chatLog.save();

    if (jsonResponse.sentiment && jsonResponse.sentiment.toLowerCase() === 'negative') {
      console.log("Negative sentiment detected, sending manager notification...");
      
      // Send email to manager
      await sendManagerNotification(message, jsonResponse.intent, jsonResponse.sentiment);
    } else {
      console.log("Sentiment:", jsonResponse.sentiment);  // Log the sentiment if not negative
    }

    // 8. Return final response
    res.json({
      intent: jsonResponse.intent,
      sentiment: jsonResponse.sentiment,
      faq: jsonResponse.faq,
      response: finalResponse,
      audioUrl: { url: audioUrls[0].url },
    });

  } catch (err) {
    console.error("AI ERROR:", err.message || err);
    res.status(500).json({ error: 'AI Error', details: err.message });
  }
};
