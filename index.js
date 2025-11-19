const express = require('express');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/logger');
const requestId = require('./middleware/requestId');
const corsMiddleware = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const config = require('./config');
const app = express();
const PORT = config.port;

app.use(requestId);
app.use(corsMiddleware);
app.use(rateLimiter(config.rateLimit.windowMs, config.rateLimit.maxRequests));
app.use(requestLogger);
app.use(express.json({ limit: config.request.bodyLimit }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Effective Computing Machine API',
    version: config.api.serviceVersion,
    endpoints: {
      health: '/health',
      users: '/api/users'
    }
  });
});

app.use('/health', healthRoutes);
app.use('/api/users', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

