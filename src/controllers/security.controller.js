const { createApiKey, validateApiKey } = require('../services/apiKey.service');

const createApiKeyController = async (req, res) => {
  try {
    const { organisationId, projectId } = req.body;
    if (!organisationId || !projectId) {
      return res.status(400).json({ error: 'organisationId and projectId required' });
    }

    const apiKey = await createApiKey(organisationId, projectId);
    res.json({ apiKey });
  } catch (err) {
    console.error('Create API Key error:', err);
    res.status(500).json({ error: err.message });
  }
}

const validateApiKeyController = async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'apiKey required' });
    }

    const result = await validateApiKey(apiKey);
    res.json(result);
  } catch (err) {
    console.error('Validate API Key error:', err);
    res.status(401).json({ error: err.message });
  }
}

module.exports = { createApiKeyController, validateApiKeyController };