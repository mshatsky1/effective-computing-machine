const express = require('express');
const userRoutes = require('./routes/users');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/logger');
const config = require('./config');
const app = express();
const PORT = config.port;

app.use(requestLogger);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Effective Computing Machine API',
    version: '0.2.0'
  });
});

app.use('/api/users', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

