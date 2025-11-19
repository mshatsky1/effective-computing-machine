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

