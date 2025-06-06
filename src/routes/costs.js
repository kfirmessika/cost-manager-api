// src/routes/costs.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines routes for cost‐related endpoints under /api:
//   • POST /api/add    → addCost()
//   • GET  /api/report → getReport()

const express = require('express');
const { addCost } = require('../controllers/costController');
const { getReport } = require('../controllers/reportController');

const router = express.Router();

// POST /api/add → addCost()
router.post('/add', addCost);

// GET /api/report → getReport()
router.get('/report', getReport);

module.exports = router;
