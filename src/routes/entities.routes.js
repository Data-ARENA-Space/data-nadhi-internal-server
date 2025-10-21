const express = require('express');
const router = express.Router();
const { 
  createOrganisation, 
  createProject, 
  createPipeline, 
  updateOrganisationProcessorId,
  updateProjectProcessorId,
  updatePipelineProcessorId,
  updatePipelineActiveStatus,
  updateStartNodeId,
  createPipelineNodesBulk
} = require('../controllers/entities.controller');

// Organisation routes
router.post('/organisation', createOrganisation);
router.put('/organisation/:orgId/processor-id', updateOrganisationProcessorId);

// Project routes (nested under organisation)
router.post('/organisation/:orgId/project', createProject);
router.put('/organisation/:orgId/project/:projectId/processor-id', updateProjectProcessorId);

// Pipeline routes (nested under organisation and project)
router.post('/organisation/:orgId/project/:projectId/pipeline', createPipeline);
router.put('/organisation/:orgId/project/:projectId/pipeline/:pipelineId/processor-id', updatePipelineProcessorId);
router.put('/organisation/:orgId/project/:projectId/pipeline/:pipelineId/active-status', updatePipelineActiveStatus);
router.put('/organisation/:orgId/project/:projectId/pipeline/:pipelineId/start-node-id', updateStartNodeId);

// Pipeline Node routes (nested under organisation, project and pipeline)
router.post('/organisation/:orgId/project/:projectId/pipeline/:pipelineId/nodes/bulk', createPipelineNodesBulk);

module.exports = router;
