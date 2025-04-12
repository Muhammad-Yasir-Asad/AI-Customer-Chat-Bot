// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const { handleImage, uploadMiddleware } = require('../controllers/imageController');

router.post('/', uploadMiddleware, handleImage);

module.exports = router;
