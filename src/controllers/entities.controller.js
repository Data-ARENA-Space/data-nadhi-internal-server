const { 
  createOrganisation: createOrganisationService,
  createProject: createProjectService,
  createPipeline: createPipelineService,
  updateEntityProcessorId,
  updatePipelineActiveStatus: updatePipelineActiveStatusService
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
    const { organisationId, projectName, processorId } = req.body;
    if (!organisationId || !projectName) {
      return res.status(400).json({ error: 'organisationId and projectName required' });
    }

    const projectId = await mongo.withRetry(async () => {
      return await createProjectService(organisationId, projectName, processorId);
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
    const { organisationId, projectId, pipelineName, pipelineCode, active, processorId } = req.body;
    if (!organisationId || !projectId || !pipelineName || !pipelineCode) {
      return res.status(400).json({ error: 'organisationId, projectId, pipelineName, and pipelineCode required' });
    }

    const pipelineId = await mongo.withRetry(async () => {
      return await createPipelineService(organisationId, projectId, pipelineName, pipelineCode, active, processorId);
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

const updateProcessorId = async (req, res) => {
  try {
    const { entityName, entityId, processorId } = req.body;
    if (!entityName || !entityId || !processorId) {
      return res.status(400).json({ error: 'entityName, entityId, and processorId required' });
    }

    await mongo.withRetry(async () => {
      return await updateEntityProcessorId(entityName, entityId, processorId);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update ProcessorId error:', err);
    if (err.message.includes('not found') || err.message.includes('Invalid entityName')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

const updatePipelineActiveStatus = async (req, res) => {
  try {
    const { organisationId, projectId, pipelineId, active } = req.body;
    if (!organisationId || !projectId || !pipelineId || active === undefined) {
      return res.status(400).json({ error: 'organisationId, projectId, pipelineId, and active required' });
    }

    await mongo.withRetry(async () => {
      return await updatePipelineActiveStatusService(organisationId, projectId, pipelineId, active);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Update Pipeline Active Status error:', err);
    if (err.message === 'Pipeline not found' || err.message.includes('boolean')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = {
  createOrganisation,
  createProject,
  createPipeline,
  updateProcessorId,
  updatePipelineActiveStatus
};
