function responseTime(req, res, next) {
  const start = process.hrtime.bigint();
  const originalEnd = res.end;

  res.end = function patchedEnd(...args) {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs) / 1e6;
    res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    originalEnd.apply(this, args);
  };

  next();
}

module.exports = responseTime;

