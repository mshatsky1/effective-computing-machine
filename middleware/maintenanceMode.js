/**
 * Maintenance mode middleware factory
 * Returns 503 for all requests except health endpoints when enabled
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether maintenance mode is active
 * @param {string} options.message - Error message to return
 * @param {boolean} options.allowHealth - Allow health endpoints during maintenance
 * @param {number} options.retryAfterSeconds - Retry-After header value
 * @returns {Function} Express middleware function
 */
function maintenanceMode(options = {}) {
  const {
    enabled = false,
    message = 'Service temporarily unavailable due to maintenance',
    allowHealth = true,
    retryAfterSeconds = 60
  } = options;

  if (!enabled) {
    return (req, res, next) => next();
  }

  const allowedPaths = new Set(['/health', '/health/ready', '/health/live']);

  return function maintenanceHandler(req, res, next) {
    if (allowHealth && allowedPaths.has(req.path)) {
      return next();
    }

    res.setHeader('Retry-After', retryAfterSeconds);
    return res.status(503).json({
      error: 'maintenance_mode',
      message,
      retryAfterSeconds
    });
  };
}

module.exports = maintenanceMode;

