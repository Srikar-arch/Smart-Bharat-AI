export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    hint: 'Check the API documentation for valid endpoints',
  });
};
