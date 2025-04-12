// controllers/imageController.js
const multer = require('multer');
const path = require('path');

// Set up Multer storage (uploads will be stored in the 'uploads' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.single('image');

exports.handleImage = async (req, res) => {
  try {
    // Access the uploaded file through req.file
    // You can now process the image using an AI image analysis library
    // For demonstration, we return a dummy response.
    const solution = "Image processed: Detected issue similar to delivery delay. Please contact support for further assistance.";
    res.json({ solution });
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).json({ error: "Image processing failed." });
  }
};
