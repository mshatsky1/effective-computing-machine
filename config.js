require('dotenv').config();
const { version } = require('./package.json');

module.exports = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  api: {
    version: 'v1',
    basePath: '/api',
    serviceVersion: version
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
  }
};

