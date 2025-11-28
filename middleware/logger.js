const config = require('../config');

/**
 * Middleware to log HTTP requests with timing and metadata
 * Logs request details when response finishes
 */
function requestLogger(req, res, next) {
  if (config.logging.level === 'silent') {
    return next();
  }

  const start = process.hrtime.bigint();
  const requestId = req.id || 'unknown';

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs) / 1e6;
    const payload = {
      requestId,
      method: req.method,
      path: req.originalUrl || req.path,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      contentLength: res.get('Content-Length') || 0,
      userAgent: req.get('user-agent') || ''
    };
    console.log(JSON.stringify(payload));
  });

  next();
}

module.exports = requestLogger;

