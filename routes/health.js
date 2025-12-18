const express = require('express');
const config = require('../config');
const router = express.Router();

/**
 * Builds a health payload with base metadata and optional overrides.
 * @param {Object} overrides Additional fields to merge into the payload
 */
function buildPayload(overrides = {}) {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: {
      name: config.service.name,
      version: config.service.version,
      environment: config.nodeEnv
    },
    rateLimit: config.rateLimit,
    ...overrides
  };
}

router.get('/', (req, res) => {
  res.json(buildPayload());
});

router.get('/live', (req, res) => {
  res.json(buildPayload({ check: 'liveness' }));
});

router.get('/ready', (req, res) => {
  const ready = {
    dependencies: {
      datastore: 'in-memory',
      cache: 'n/a'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  };
  res.json(buildPayload({ check: 'readiness', details: ready }));
});

module.exports = router;

