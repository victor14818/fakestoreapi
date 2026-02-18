module.exports = (error, req, res, next) => {

  console.log(error);

  if (error.name === 'NotFoundError') {
    return res
      .status(404)
      .type('application/problem+json')
      .json({
        title: 'Resource not found',
        status: 404,
        detail: error.message,
        instance: req.originalUrl
      });
  }

  if (error.name === 'DomainValidationError') {
    return res
      .status(422)
      .type('application/problem+json')
      .json({
        title: 'Validation failed',
        status: 422,
        detail: error.message,
        instance: req.originalUrl
      });
  }

  return res.status(500).json({
    title: 'Internal Server Error',
    status: 500
  });
};
