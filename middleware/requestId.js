/**
 * Middleware to generate and attach a unique request ID
 * Sets X-Request-ID header for request tracing
 */
function requestIdMiddleware(req, res, next) {
  // Use existing X-Request-ID header if present, otherwise generate one
  const existingId = req.get('X-Request-ID');
  if (existingId) {
    req.id = existingId;
  } else {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    req.id = `${timestamp}-${random}`;
  }
  res.setHeader('X-Request-ID', req.id);
  next();
}

module.exports = requestIdMiddleware;

