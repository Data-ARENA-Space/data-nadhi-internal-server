const MongoService = require('../services/mongo.service');
const mongo = new MongoService();

const getHealth = async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        mongodb: 'checking...'
      }
    };

    // Check MongoDB connection
    try {
      await mongo.withRetry(async () => {
        await mongo.db().admin().ping();
      });
      health.services.mongodb = 'ok';
    } catch (err) {
      health.services.mongodb = 'error';
      health.status = 'degraded';
    }

    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

const getReadiness = async (req, res) => {
  try {
    await mongo.withRetry(async () => {
      await mongo.db().admin().ping();
    });

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = { getHealth, getReadiness };
