/**
 * Middleware to measure and report response time
 * Sets X-Response-Time header with duration in milliseconds
 */
function responseTime(req, res, next) {
  const start = process.hrtime.bigint();
  const originalEnd = res.end;

  res.end = function patchedEnd(...args) {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs) / 1e6;
    const roundedMs = Math.round(durationMs * 100) / 100;
    res.setHeader('X-Response-Time', `${roundedMs.toFixed(2)}ms`);
    originalEnd.apply(this, args);
  };

  next();
}

module.exports = responseTime;

