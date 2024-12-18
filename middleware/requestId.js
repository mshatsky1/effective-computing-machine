const { v4: uuidv4 } = require('uuid');

function requestIdMiddleware(req, res, next) {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
}

module.exports = requestIdMiddleware;

