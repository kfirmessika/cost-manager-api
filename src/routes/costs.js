const express = require('express');
const { addCost } = require('../controllers/costController');
const { getReport } = require('../controllers/reportController');
const router = express.Router();

router.post('/add', addCost);
router.get('/report', getReport);

module.exports = router;
