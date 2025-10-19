const express = require('express');
const router = express.Router();
const { getHealth, getReadiness } = require('../controllers/health.controller');

// Health check routes
router.get('/', getHealth);
router.get('/readiness', getReadiness);

module.exports = router;
