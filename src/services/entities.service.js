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
  // Verify organisation exists
  const org = await mongoDal.getOrganisation(organisationId);
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
  // Verify organisation and project exist
  const org = await mongoDal.getOrganisation(organisationId);
  if (!org) {
    throw new Error('Organisation not found');
  }

  const project = await mongoDal.getProject(organisationId, projectId);
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
const updateEntityProcessorId = async (entityName, entityId, processorId) => {
  let updateResult;

  switch (entityName.toLowerCase()) {
    case 'organisation':
      updateResult = await mongoDal.updateOrganisation(entityId, { processorId });
      cacheDal.deleteOrgKey(entityId);
      break;

    case 'project':
      const project = await mongoDal.findProjectById(entityId);
      if (!project) {
        throw new Error('Project not found');
      }
      updateResult = await mongoDal.updateProject(project.organisationId, entityId, { processorId });
      cacheDal.deleteProjectKey(project.organisationId, entityId);
      break;

    case 'pipeline':
      const pipeline = await mongoDal.findPipelineById(entityId);
      if (!pipeline) {
        throw new Error('Pipeline not found');
      }
      updateResult = await mongoDal.updatePipeline(pipeline.organisationId, pipeline.projectId, entityId, { processorId });
      cacheDal.deletePipelineKeyById(pipeline.organisationId, pipeline.projectId, entityId);
      cacheDal.deletePipelineKeyByCode(pipeline.organisationId, pipeline.projectId, pipeline.pipelineCode);
      break;

    default:
      throw new Error('Invalid entityName. Must be organisation, project, or pipeline');
  }

  if (updateResult.matchedCount === 0) {
    throw new Error('Entity not found');
  }

  return true;
}

const updatePipelineActiveStatus = async (organisationId, projectId, pipelineId, active) => {
  if (typeof active !== 'boolean') {
    throw new Error('active must be a boolean value');
  }

  const pipeline = await mongoDal.findPipelineById(pipelineId);
  if (!pipeline) {
    throw new Error('Pipeline not found');
  }

  const updateResult = await mongoDal.updatePipeline(organisationId, projectId, pipelineId, { active });
  cacheDal.deletePipelineKeyById(organisationId, projectId, pipelineId);
  cacheDal.deletePipelineKeyByCode(organisationId, projectId, pipeline.pipelineCode);

  if (updateResult.matchedCount === 0) {
    throw new Error('Pipeline not found');
  }

  return true;
}

module.exports = { 
  getOrganisationSecret, 
  getProjectSecret,
  createOrganisation,
  createProject,
  createPipeline,
  updateEntityProcessorId,
  updatePipelineActiveStatus
};
