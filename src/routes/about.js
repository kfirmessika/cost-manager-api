// src/routes/about.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines the route for GET /api/about.

const express = require('express');
const { getAbout } = require('../controllers/aboutController');
const router = express.Router();

// GET /api/about → getAbout()
router.get('/about', getAbout);

module.exports = router;
