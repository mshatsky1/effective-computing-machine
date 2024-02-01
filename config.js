module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  api: {
    version: 'v1',
    basePath: '/api'
  }
};

