module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  api: {
    version: 'v1',
    basePath: '/api'
  },
  rateLimit: {
    windowMs: 60000,
    maxRequests: 100
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
};

