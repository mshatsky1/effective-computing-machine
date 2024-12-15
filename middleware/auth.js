function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  // Simple API key authentication
  // In production, this should check against a database
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  // For now, accept any non-empty API key
  // TODO: Implement proper API key validation
  if (apiKey.trim().length === 0) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  req.apiKey = apiKey;
  next();
}

module.exports = authenticate;

