const express = require('express');
const config = require('../config');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: {
      name: config.service.name,
      version: config.service.version,
      environment: config.nodeEnv
    },
    rateLimit: config.rateLimit,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;

