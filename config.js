require('dotenv').config();
const { version } = require('./package.json');
const { LOG_LEVELS } = require('./utils/constants');

function resolveLogLevel(level) {
  const normalized = (level || 'info').toLowerCase();
  if (LOG_LEVELS.includes(normalized)) {
    return normalized;
  }
  return 'info';
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  api: {
    version: 'v1',
    basePath: '/api',
    serviceVersion: version
  },
  service: {
    name: 'Effective Computing Machine API',
    description: 'A REST API service for managing users',
    owner: 'Platform Team',
    version
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  },
  request: {
    bodyLimit: process.env.REQUEST_BODY_LIMIT || '10mb'
  },
  logging: {
    level: resolveLogLevel(process.env.LOG_LEVEL)
  },
  maintenance: {
    enabled: process.env.MAINTENANCE_MODE === 'true',
    message: process.env.MAINTENANCE_MESSAGE || 'Service is temporarily undergoing maintenance',
    allowHealth: process.env.MAINTENANCE_ALLOW_HEALTH !== 'false',
    retryAfterSeconds: Number(process.env.MAINTENANCE_RETRY_AFTER) || 60
  }
};

