function requestIdMiddleware(req, res, next) {
  // Generate a simple request ID using timestamp and random number
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  req.id = `${timestamp}-${random}`;
  res.setHeader('X-Request-ID', req.id);
  next();
}

module.exports = requestIdMiddleware;

