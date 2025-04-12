const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const HF_API_TOKEN = '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'; // Paste your Hugging Face token here

exports.uploadMiddleware = multer({ 
  // your multer configuration
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
}).single('file');

// Core AI Handler for image-based queries
exports.handleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const imagePath = path.resolve(req.file.path);

    // Resize and convert image to JPEG buffer
    const imageBuffer = await sharp(imagePath).resize(224, 224).jpeg().toBuffer();

    // Call Hugging Face ViT API
    const responseHF = await axios.post(
      'https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224',
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'image/jpeg'
        },
        method: "POST",
        body: imageBuffer
      }
    );

    if (!responseHF.data || !Array.isArray(responseHF.data)) {
      return res.status(500).json({ error: "Unexpected response from image API." });
    }

    const topPrediction = responseHF.data[0]; // Best match
    const detectedLabel = topPrediction.label;
    const confidence = topPrediction.score;

    // === AI Customer Support Logic ===
    let intent = "general_query";
    let sentiment = "neutral";
    let faq = null;
    let response = "Thank you for your image. Let me look into this for you.";

    const label = detectedLabel.toLowerCase();

    if (label.includes("broken") || label.includes("damage") || label.includes("crack")) {
      intent = "report_damage";
      sentiment = "negative";
      faq = "return_policy";
      response = "I'm really sorry to see that your item arrived damaged. You may be eligible for a free replacement or return. Please visit our Returns page or contact support directly.";
    } 
    else if (label.includes("box") || label.includes("carton") || label.includes("package")) {
      intent = "delivery_status";
      sentiment = "neutral";
      faq = "delivery_tracking";
      response = "It looks like this is your delivery package. If there are any problems like missing items or delays, let us know and we’ll investigate further.";
    } 
    else {
      intent = "unclear";
      sentiment = "neutral";
      faq = "support_contact";
      response = "We couldn’t clearly identify the issue in the image. Could you please share more details or try uploading a different image?";
    }

    const escalate = sentiment === "negative" && intent === "report_damage";

    return res.json({
      success: true,
      detectedLabel,
      confidence: confidence.toFixed(2),
      intent,
      sentiment,
      faq,
      escalate,
      response
    });

  } catch (error) {
    console.error("Image processing error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image processing failed." });
  }
};
