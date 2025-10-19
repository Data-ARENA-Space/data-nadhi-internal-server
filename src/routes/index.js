const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health.routes');
const securityRoutes = require('./security.routes');
const entitiesRoutes = require('./entities.routes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/api/security', securityRoutes);
router.use('/api/entities', entitiesRoutes);

module.exports = router;