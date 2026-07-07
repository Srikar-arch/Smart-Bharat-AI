export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: `A record with this ${Object.keys(err.keyValue).join(', ')} already exists.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation failed', messages });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
  });
};
