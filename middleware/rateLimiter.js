const rateLimitMap = new Map();

/**
 * Rate limiting middleware factory
 * @param {number} windowMs - Time window in milliseconds (default: 60000)
 * @param {number} maxRequests - Maximum requests per window (default: 100)
 * @returns {Function} Express middleware function
 */
function rateLimiter(windowMs = 60000, maxRequests = 100) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const limit = rateLimitMap.get(ip);
    
    if (now > limit.resetTime) {
      limit.count = 1;
      limit.resetTime = now + windowMs;
      return next();
    }
    
    if (limit.count >= maxRequests) {
      const retryAfter = Math.ceil((limit.resetTime - now) / 1000);
      return res.status(429).json({ 
        error: 'Too many requests, please try again later',
        retryAfter
      });
    }
    
    limit.count++;
    next();
  };
}

module.exports = rateLimiter;

