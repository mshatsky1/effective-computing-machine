function errorHandler(err, req, res, next) {
  console.error('Error:', err.stack);
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'An unexpected error occurred';
  res.status(statusCode).json({ 
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

module.exports = { errorHandler, notFoundHandler };

