const express = require('express');
const router = express.Router();
const { createApiKeyController, validateApiKeyController } = require('../controllers/security.controller');

// Security API routes - RESTful pattern
router.post('/api-key', createApiKeyController);
router.post('/api-key/validate', validateApiKeyController);

module.exports = router;
