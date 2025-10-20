const { createApiKey, validateApiKey } = require('../services/apiKey.service');

const createApiKeyController = async (req, res) => {
  try {
    const { orgId, projectId } = req.params;
    
    const apiKey = await createApiKey(orgId, projectId);
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