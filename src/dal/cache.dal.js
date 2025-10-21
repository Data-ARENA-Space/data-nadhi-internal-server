let redis = null;

const setRedisService = (redisService) => {
  redis = redisService;
}

const getApiKey = async (apiKey) => {
  if (!redis || !redis.connected) return null;
  return await redis.safe_get(`datanadhiserver:apikey:${apiKey}`);
}

const setApiKey = async (apiKey, data, ttl) => {
  if (!redis || !redis.connected) return;
  await redis.safe_set(`datanadhiserver:apikey:${apiKey}`, data, ttl);
}

const getOrganisation = async (orgId) => {
  if (!redis || !redis.connected) return null;
  return await redis.safe_get(`datanadhiserver:org:${orgId}`);
}

const setOrganisation = async (orgId, data, ttl = 1800) => {
  if (!redis || !redis.connected) return;
  await redis.safe_set(`datanadhiserver:org:${orgId}`, data, ttl);
}

const getProject = async (orgId, projectId) => {
  if (!redis || !redis.connected) return null;
  return await redis.safe_get(`datanadhiserver:org:${orgId}:prj:${projectId}`);
}

const setProject = async (orgId, projectId, data, ttl = 1800) => {
  if (!redis || !redis.connected) return;
  await redis.safe_set(`datanadhiserver:org:${orgId}:prj:${projectId}`, data, ttl);
}

const getPipeline = async (orgId, projectId, pipelineId) => {
  if (!redis || !redis.connected) return null;
  return await redis.safe_get(`datanadhiserver:org:${orgId}:prj:${projectId}:pl:${pipelineId}`);
}

const setPipeline = async (orgId, projectId, pipelineId, data, ttl = 1800) => {
  if (!redis || !redis.connected) return;
  await redis.safe_set(`datanadhiserver:org:${orgId}:prj:${projectId}:pl:${pipelineId}`, data, ttl);
}


const getOrganisationSecret = async (orgId) => {
  if (!redis || !redis.connected) return null;
  return await redis.safe_get(`datanadhiserver:org:${orgId}:secret`);
}

const setOrganisationSecret = async (orgId, secret, ttl = 3600) => {
  if (!redis || !redis.connected) return;
  await redis.safe_set(`datanadhiserver:org:${orgId}:secret`, secret, ttl);
}

const getProjectSecret = async (orgId, projectId) => {
  if (!redis || !redis.connected) return null;
  return await redis.safe_get(`datanadhiserver:org:${orgId}:prj:${projectId}:secret`);
}

const setProjectSecret = async (orgId, projectId, secret, ttl = 3600) => {
  if (!redis || !redis.connected) return;
  await redis.safe_set(`datanadhiserver:org:${orgId}:prj:${projectId}:secret`, secret, ttl);
}

const deleteOrgKey = async (orgId) => {
  if (!redis || !redis.connected) return;
  await redis.deleteKeysContaining(`org:${orgId}`);
}

const deleteProjectKey = async (orgId, projectId) => {
  if (!redis || !redis.connected) return;
  await redis.deleteKeysContaining(`org:${orgId}:prj:${projectId}`);
}

const deletePipelineKeyById = async (orgId, projectId, pipelineId) => {
  if (!redis || !redis.connected) return;
  await redis.deleteKeysContaining(`org:${orgId}:prj:${projectId}:pl:${pipelineId}`);
}

const deletePipelineKeyByCode = async (orgId, projectId, pipelineCode) => {
  if (!redis || !redis.connected) return;
  await redis.deleteKeysContaining(`org:${orgId}:prj:${projectId}:plc:${pipelineCode}`);
}

const getIntegrationConnector = async (orgId, projectId, connectorId) => {
  if (!redis || !redis.connected) return null;
  return await redis.safe_get(`datanadhiserver:org:${orgId}:prj:${projectId}:ic:${connectorId}`);
}

const setIntegrationConnector = async (orgId, projectId, connectorId, data, ttl = 1800) => {
  if (!redis || !redis.connected) return;
  await redis.safe_set(`datanadhiserver:org:${orgId}:prj:${projectId}:ic:${connectorId}`, data, ttl);
}



module.exports = {
  setRedisService,
  getApiKey,
  setApiKey,
  getOrganisation,
  setOrganisation,
  getProject,
  setProject,
  getPipeline,
  setPipeline,
  getOrganisationSecret,
  setOrganisationSecret,
  getProjectSecret,
  setProjectSecret,
  deleteOrgKey,
  deleteProjectKey,
  getIntegrationConnector,
  setIntegrationConnector,
  deletePipelineKeyByCode,
  deletePipelineKeyById
};
