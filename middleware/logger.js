function requestLogger(req, res, next) {
  const start = Date.now();
  const originalSend = res.send;
  const requestId = req.id || 'unknown';
  
  res.send = function(data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode || 200;
    console.log(`[${requestId}] ${req.method} ${req.path} - ${statusCode} - ${duration}ms`);
    originalSend.call(this, data);
  };
  
  next();
}

module.exports = requestLogger;

