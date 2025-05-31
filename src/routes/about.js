// src/routes/about.js
const express = require('express');
const { getAbout } = require('../controllers/aboutController');
const router = express.Router();

router.get('/about', getAbout);

module.exports = router;
