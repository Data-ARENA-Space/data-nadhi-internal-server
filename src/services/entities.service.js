const { encryptAesGcm, decryptAesGcm, generateBase64Secret } = require('./crypto.service');
const crypto = require('crypto');

const mongoDal = require('../dal/mongo.dal');
const cacheDal = require('../dal/cache.dal');

const {SEC_DB, ENTITY_CACHE_TTL_SECONDS, SECRET_CACHE_TTL_SECONDS} = process.env;

const getOrganisationById = async (orgId) => {
  // Check cache first
  let org = await cacheDal.getOrganisation(orgId);
  if (org) return org;

  org = await mongoDal.getOrganisation(orgId);
  if (org) {
    cacheDal.setOrganisation(orgId, org, ENTITY_CACHE_TTL_SECONDS);
  }
  return org;
}

const getProjectById = async (orgId, projectId) => {
  // Check cache first
  let project = await cacheDal.getProject(orgId, projectId);
  if (project) return project;

  project = await mongoDal.getProject(orgId, projectId);
  if (project) {
    cacheDal.setProject(orgId, projectId, project, ENTITY_CACHE_TTL_SECONDS);
  }
  return project;
}

const getPipelineById = async (orgId, projectId, pipelineId) => {
  // Check cache first
  let pipeline = await cacheDal.getPipeline(orgId, projectId, pipelineId);
  if (pipeline) return pipeline;

  pipeline = await mongoDal.getPipeline(orgId, projectId, pipelineId);
  if (pipeline) {
    cacheDal.setPipeline(orgId, projectId, pipelineId, pipeline, ENTITY_CACHE_TTL_SECONDS);
  }
  return pipeline;
}

const getOrganisationSecret = async (orgId) => {
  let orgSecret = await cacheDal.getOrganisationSecret(orgId);
  if (!orgSecret) {
    let organisation = await getOrganisationById(orgId);
    if (!organisation) throw new Error('Organisation not found');
    orgSecret = decryptAesGcm(organisation.organisationSecretEncrypted, SEC_DB);
    cacheDal.setOrganisationSecret(orgId, orgSecret, SECRET_CACHE_TTL_SECONDS);
  }
  return orgSecret;
}

const getProjectSecret = async (orgId, projectId) => {
  let projectSecret = await cacheDal.getProjectSecret(orgId, projectId);
  if (!projectSecret) {
    let project = await getProjectById(orgId, projectId);
    if (!project) throw new Error('Project not found');
    projectSecret = decryptAesGcm(project.projectSecretEncrypted, SEC_DB);
    cacheDal.setProjectSecret(orgId, projectId, projectSecret, SECRET_CACHE_TTL_SECONDS);
  }
  return projectSecret;
}

// Entity creation functions
const createOrganisation = async (organisationName, processorId) => {
  const organisationId = crypto.randomUUID();
  const organisationSecret = generateBase64Secret(15);
  const organisationSecretEncrypted = encryptAesGcm(organisationSecret, SEC_DB);

  const orgData = {
    organisationName,
    organisationId,
    organisationSecretEncrypted
  };

  if (processorId) {
    orgData.processorId = processorId;
  }

  await mongoDal.createOrganisation(orgData);
  return organisationId;
}

const createProject = async (organisationId, projectName, processorId) => {
  // Verify organisation exists using cached service
  const org = await getOrganisationById(organisationId);
  if (!org) {
    throw new Error('Organisation not found');
  }

  const projectId = crypto.randomUUID();
  const projectSecret = generateBase64Secret(15);
  const projectSecretEncrypted = encryptAesGcm(projectSecret, SEC_DB);

  const projectData = {
    projectName,
    organisationId,
    projectId,
    projectSecretEncrypted
  };

  if (processorId) {
    projectData.processorId = processorId;
  }

  await mongoDal.createProject(projectData);
  return projectId;
}

const createPipeline = async (organisationId, projectId, pipelineName, pipelineCode, active, processorId) => {
  const project = await getProjectById(organisationId, projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const pipelineId = crypto.randomUUID();

  const pipelineData = {
    organisationId,
    projectId,
    pipelineName,
    pipelineCode,
    active: active !== undefined ? active : true,
    pipelineId
  };

  if (processorId) {
    pipelineData.processorId = processorId;
  }

  await mongoDal.createPipeline(pipelineData);
  return pipelineId;
}

// Entity update functions
const updateOrganisationProcessorId = async (orgId, processorId) => {
  // Verify organisation exists using cached service
  const org = await getOrganisationById(orgId);
  if (!org) {
    throw new Error('Organisation not found');
  }

  const updateResult = await mongoDal.updateOrganisation(orgId, { processorId });
  
  if (updateResult.matchedCount === 0) {
    throw new Error('Organisation not found');
  }

  // Clear cache for this organisation
  cacheDal.deleteOrgKey(orgId);
  return true;
}

const updateProjectProcessorId = async (orgId, projectId, processorId) => {
  // Verify project exists using cached service  
  const project = await getProjectById(orgId, projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const updateResult = await mongoDal.updateProject(orgId, projectId, { processorId });
  
  if (updateResult.matchedCount === 0) {
    throw new Error('Project not found');
  }

  // Clear cache for this project
  cacheDal.deleteProjectKey(orgId, projectId);
  return true;
}

const updatePipelineProcessorId = async (orgId, projectId, pipelineId, processorId) => {
  // Verify pipeline exists using mongo service (no cached pipeline getter available)
  const pipeline = await getPipelineById(orgId, projectId, pipelineId);
  if (!pipeline) {
    throw new Error('Pipeline not found');
  }

  const updateResult = await mongoDal.updatePipeline(orgId, projectId, pipelineId, { processorId });
  
  if (updateResult.matchedCount === 0) {
    throw new Error('Pipeline not found');
  }

  // Clear cache for this pipeline (if cache methods existed)
  cacheDal.deletePipelineKeyById(orgId, projectId, pipelineId);
  cacheDal.deletePipelineKeyByCode(orgId, projectId, pipeline.pipelineCode);
  return true;
}

const updatePipelineActiveStatus = async (organisationId, projectId, pipelineId, active) => {
  if (typeof active !== 'boolean') {
    throw new Error('active must be a boolean value');
  }

  // Verify pipeline exists using proper orgId and projectId
  const pipeline = await getPipelineById(organisationId, projectId, pipelineId);
  if (!pipeline) {
    throw new Error('Pipeline not found');
  }

  const updateResult = await mongoDal.updatePipeline(organisationId, projectId, pipelineId, { active });
  
  if (updateResult.matchedCount === 0) {
    throw new Error('Pipeline not found');
  }

  // Clear cache for this pipeline (if cache methods existed)
  cacheDal.deletePipelineKeyById(organisationId, projectId, pipelineId);
  cacheDal.deletePipelineKeyByCode(organisationId, projectId, pipeline.pipelineCode);
  return true;
}

const updateStartNodeId = async (organisationId, projectId, pipelineId, startNodeId) => {
  const pipeline = await getPipelineById(organisationId, projectId, pipelineId);
  if (!pipeline) {
    throw new Error('Pipeline not found');
  }

  const updateResult = await mongoDal.updatePipeline(organisationId, projectId, pipelineId, { startNodeId });

  if (updateResult.matchedCount === 0) {
    throw new Error('Pipeline not found');
  }

  // Clear cache for this pipeline (if cache methods existed)
  cacheDal.deletePipelineKeyById(organisationId, projectId, pipelineId);
  cacheDal.deletePipelineKeyByCode(organisationId, projectId, pipeline.pipelineCode);
  return true;
}

const createPipelineNodesBulk = async (organisationId, projectId, pipelineId, pipelineNodesObj) => {
  const pipeline = await getPipelineById(organisationId, projectId, pipelineId);
  if (!pipeline) {
    throw new Error('Pipeline not found');
  }

  // First delete existing nodes for this pipeline
  await mongoDal.deletePipelineNodesByPipelineId(organisationId, projectId, pipelineId);

  // Now create new nodes
  const nodesData = Object.entries(pipelineNodesObj).map(([nodeId, node]) => ({
    nodeConfig: node,
    nodeId,
    pipelineId,
    projectId,
    organisationId
  }));

  // Bulk insert all nodes
  await mongoDal.createPipelineNodesBulk(nodesData);
  return nodesData.length;
}

const getIntegrationConnector = async (organisationId, projectId, connectorId) => {
  let integrationConnector = await cacheDal.getIntegrationConnector(organisationId, projectId, connectorId);
  if (integrationConnector) return integrationConnector;

  integrationConnector = await mongoDal.getIntegrationConnector(organisationId, projectId, connectorId);
  if (integrationConnector) {
    cacheDal.setIntegrationConnector(organisationId, projectId, connectorId, integrationConnector, ENTITY_CACHE_TTL_SECONDS);
  }
  return integrationConnector;
}

const createIntegrationConnector = async (organisationId, projectId, connectorName, integrationType, integrationCredentials) => {
  const connectorId = crypto.randomUUID();
  const encryptedCreds = encryptAesGcm(JSON.stringify(integrationCredentials || {}), SEC_DB);
  const project = await getProjectById(organisationId, projectId);
  if (!project) throw new Error('Project not found');
  const integrationConnectorData = {
    organisationId,
    projectId,
    connectorId,
    connectorName,
    integrationType,
    encryptedCredentials: encryptedCreds
  };
  await mongoDal.createIntegrationConnector(integrationConnectorData);
  return connectorId;
}

const createIntegrationTarget = async (organisationId, projectId, connectorId, pipelineId, destinationName, destinationParams) => {
  // Validate connector exists
  const connector = await getIntegrationConnector(organisationId, projectId, connectorId);
  if (!connector) throw new Error('Connector not found');
  // Validate pipeline exists
  const pipeline = await getPipelineById(organisationId, projectId, pipelineId);
  if (!pipeline) throw new Error('Pipeline not found');

  const targetId = crypto.randomUUID();
  const integrationTargetData = {
    organisationId,
    projectId,
    targetId,
    connectorId,
    pipelineId,
    destinationName,
    destinationParams: destinationParams || {}
  };
  await mongoDal.createIntegrationTarget(integrationTargetData);
  return targetId;
}

module.exports = { 
  getOrganisationSecret, 
  getProjectSecret,
  createOrganisation,
  createProject,
  createPipeline,
  updateOrganisationProcessorId,
  updateProjectProcessorId,
  updatePipelineProcessorId,
  updatePipelineActiveStatus,
  updateStartNodeId,
  createIntegrationConnector,
  createPipelineNodesBulk,
  createIntegrationTarget
};
