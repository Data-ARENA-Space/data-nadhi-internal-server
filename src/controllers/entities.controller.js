const { 
  createOrganisation: createOrganisationService,
  createProject: createProjectService,
  createPipeline: createPipelineService,
  updateOrganisationProcessorId: updateOrganisationProcessorIdService,
  updateProjectProcessorId: updateProjectProcessorIdService,
  updatePipelineProcessorId: updatePipelineProcessorIdService,
  updatePipelineActiveStatus: updatePipelineActiveStatusService,
  updateStartNodeId: updateStartNodeIdService,
  createPipelineNodesBulk: createPipelineNodesBulkService
} = require('../services/entities.service');
const MongoService = require('../services/mongo.service');

const mongo = new MongoService();

const createOrganisation = async (req, res) => {
  try {
    const { organisationName, processorId } = req.body;
    if (!organisationName) {
      return res.status(400).json({ error: 'organisationName required' });
    }

    const organisationId = await mongo.withRetry(async () => {
      return await createOrganisationService(organisationName, processorId);
    });

    res.json({ organisationId });
  } catch (err) {
    console.error('Create Organisation error:', err);
    res.status(500).json({ error: err.message });
  }
}

const createProject = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { projectName, processorId } = req.body;
    if (!projectName) {
      return res.status(400).json({ error: 'projectName required' });
    }

    const projectId = await mongo.withRetry(async () => {
      return await createProjectService(orgId, projectName, processorId);
    });

    res.json({ projectId });
  } catch (err) {
    console.error('Create Project error:', err);
    if (err.message === 'Organisation not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const createPipeline = async (req, res) => {
  try {
    const { orgId, projectId } = req.params;
    const { pipelineName, pipelineCode, active, processorId } = req.body;
    if (!pipelineName || !pipelineCode) {
      return res.status(400).json({ error: 'pipelineName and pipelineCode required' });
    }

    const pipelineId = await mongo.withRetry(async () => {
      return await createPipelineService(orgId, projectId, pipelineName, pipelineCode, active, processorId);
    });

    res.json({ pipelineId });
  } catch (err) {
    console.error('Create Pipeline error:', err);
    if (err.message === 'Organisation not found' || err.message === 'Project not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const updateOrganisationProcessorId = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { processorId } = req.body;
    if (!processorId) {
      return res.status(400).json({ error: 'processorId required' });
    }

    await mongo.withRetry(async () => {
      return await updateOrganisationProcessorIdService(orgId, processorId);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update Organisation ProcessorId error:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const updateProjectProcessorId = async (req, res) => {
  try {
    const { orgId, projectId } = req.params;
    const { processorId } = req.body;
    if (!processorId) {
      return res.status(400).json({ error: 'processorId required' });
    }

    await mongo.withRetry(async () => {
      return await updateProjectProcessorIdService(orgId, projectId, processorId);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update Project ProcessorId error:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const updatePipelineProcessorId = async (req, res) => {
  try {
    const { orgId, projectId, pipelineId } = req.params;
    const { processorId } = req.body;
    if (!processorId) {
      return res.status(400).json({ error: 'processorId required' });
    }

    await mongo.withRetry(async () => {
      return await updatePipelineProcessorIdService(orgId, projectId, pipelineId, processorId);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update Pipeline ProcessorId error:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const updatePipelineActiveStatus = async (req, res) => {
  try {
    const { orgId, projectId, pipelineId } = req.params;
    const { active } = req.body;
    if (active === undefined) {
      return res.status(400).json({ error: 'active status required' });
    }

    await mongo.withRetry(async () => {
      return await updatePipelineActiveStatusService(orgId, projectId, pipelineId, active);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update Pipeline Active Status error:', err);
    if (err.message === 'Pipeline not found' || err.message.includes('boolean')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const updateStartNodeId = async (req, res) => {
  try {
    const { orgId, projectId, pipelineId } = req.params;
    const { startNodeId } = req.body;
    if (!startNodeId) {
      return res.status(400).json({ error: 'startNodeId required' });
    }

    await mongo.withRetry(async () => {
      return await updateStartNodeIdService(orgId, projectId, pipelineId, startNodeId);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update Start Node ID error:', err);
    if (err.message === 'Pipeline not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const createPipelineNodesBulk = async (req, res) => {
  try {
    const { orgId, projectId, pipelineId } = req.params;
    const pipelineNodesObj = req.body;

    if (!pipelineNodesObj || typeof pipelineNodesObj !== 'object') {
      return res.status(400).json({ error: 'pipelineNodesObj required in request body' });
    }

    const nodeCount = await mongo.withRetry(async () => {
      return await createPipelineNodesBulkService(orgId, projectId, pipelineId, pipelineNodesObj);
    });

    res.json({ nodeCount, success: true });
  } catch (err) {
    console.error('Create Pipeline Nodes Bulk error:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = {
  createOrganisation,
  createProject,
  createPipeline,
  updateOrganisationProcessorId,
  updateProjectProcessorId,
  updatePipelineProcessorId,
  updatePipelineActiveStatus,
  updateStartNodeId,
  createPipelineNodesBulk
};
