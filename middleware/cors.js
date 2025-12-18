const config = require('../config');

/**
 * CORS middleware to handle cross-origin requests
 * Handles preflight OPTIONS requests and sets appropriate headers
 */
function corsMiddleware(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.cors.origin);
  res.header('Access-Control-Allow-Methods', config.cors.methods.join(', '));
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
}

module.exports = corsMiddleware;

