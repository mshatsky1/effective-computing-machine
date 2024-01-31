function requestLogger(req, res, next) {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode || 200;
    console.log(`${req.method} ${req.path} - ${statusCode} - ${duration}ms`);
    originalSend.call(this, data);
  };
  
  next();
}

module.exports = requestLogger;

