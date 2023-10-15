const ServerError = require('./errors/ServerError');
const { serverErrorText } = require('../utils/errorsTexts');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ServerError
        ? serverErrorText
        : message,
    });
  next();
};

module.exports = errorHandler;
