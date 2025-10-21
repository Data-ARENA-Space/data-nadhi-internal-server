const MongoService = require('../services/mongo.service');
const mongoService = new MongoService(); // singleton instance


const getProject = (orgId, projectId) => {
  const db = mongoService.db();
  return db.collection('Projects').findOne({ projectId, organisationId: orgId });
}

const getOrganisation = (orgId) => {
  const db = mongoService.db();
  return db.collection('Organisations').findOne({ organisationId: orgId });
}

const getPipeline = (orgId, projectId, pipelineId) => {
  const db = mongoService.db();
  return db.collection('Pipelines').findOne({ pipelineId, projectId, organisationId: orgId });
}

const createOrganisation = (orgData) => {
  const db = mongoService.db();
  return db.collection('Organisations').insertOne(orgData);
}

const createProject = (projectData) => {
  const db = mongoService.db();
  return db.collection('Projects').insertOne(projectData);
}

const createPipeline = (pipelineData) => {
  const db = mongoService.db();
  return db.collection('Pipelines').insertOne(pipelineData);
}

const updateOrganisation = (orgId, updateData) => {
  const db = mongoService.db();
  return db.collection('Organisations').updateOne({ organisationId: orgId }, { $set: updateData });
}

const updateProject = (orgId, projectId, updateData) => {
  const db = mongoService.db();
  return db.collection('Projects').updateOne({ organisationId: orgId, projectId }, { $set: updateData });
}

const updatePipeline = (orgId, projectId, pipelineId, updateData) => {
  const db = mongoService.db();
  return db.collection('Pipelines').updateOne({ organisationId: orgId, projectId, pipelineId }, { $set: updateData });
}

// Generic find methods for updating entities by ID only
const findProjectById = (projectId) => {
  const db = mongoService.db();
  return db.collection('Projects').findOne({ projectId });
}

const findPipelineById = (pipelineId) => {
  const db = mongoService.db();
  return db.collection('Pipelines').findOne({ pipelineId });
}

const createPipelineNodesBulk = (nodesData) => {
    const db = mongoService.db();
    return db.collection('PipelineNodes').insertMany(nodesData);
}

const deletePipelineNodesByPipelineId = (organisationId, projectId, pipelineId) => {
  const db = mongoService.db();
  return db.collection('PipelineNodes').deleteMany({ organisationId, projectId, pipelineId });
}

module.exports = { 
  getProject, 
  getOrganisation, 
  createOrganisation,
  createProject,
  createPipeline,
  updateOrganisation,
  updateProject,
  updatePipeline,
  findProjectById,
  deletePipelineNodesByPipelineId,
  createPipelineNodesBulk,
  findPipelineById,
  getPipeline,
  mongoService 
};
