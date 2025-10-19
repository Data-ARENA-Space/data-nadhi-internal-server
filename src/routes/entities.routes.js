const express = require('express');
const router = express.Router();
const { 
  createOrganisation, 
  createProject, 
  createPipeline, 
  updateProcessorId, 
  updatePipelineActiveStatus 
} = require('../controllers/entities.controller');

// Entity Management API routes - RESTful pattern
router.post('/organisation', createOrganisation);
router.post('/project', createProject);
router.post('/pipeline', createPipeline);
router.put('/processor-id', updateProcessorId);
router.put('/pipeline/active-status', updatePipelineActiveStatus);

module.exports = router;
