/**
 * Middleware to enforce JSON content type for API requests with body
 * Returns 415 for non-JSON requests to POST/PUT/PATCH endpoints
 */
function requireJson(req, res, next) {
  const requiresBody = ['POST', 'PUT', 'PATCH'].includes(req.method);
  const targetsApi = req.path.startsWith('/api/');

  if (!requiresBody || !targetsApi) {
    return next();
  }

  if (req.is('application/json')) {
    return next();
  }

  return res.status(415).json({
    error: 'unsupported_media_type',
    message: 'Requests must use Content-Type: application/json',
    received: req.get('Content-Type') || 'none'
  });
}

module.exports = requireJson;

