const logger = require('../utils/logger');
const { HTTP_STATUS, ERROR_CODES, MESSAGES } = require('../config/constants');

const errorHandler = (err, req, res, next) => {
  const requestId = req.id || 'unknown';

  // Log the error
  logger.error(`Request ${requestId}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Handle Joi validation errors
  if (err.isJoi) {
    const details = err.details[0];
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      code: ERROR_CODES.VALIDATION_ERROR,
      message: MESSAGES.INVALID_REQUEST,
      details: {
        field: details.path.join('.'),
        message: details.message
      }
    });
  }

  // Handle custom validation errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code || ERROR_CODES.INVALID_INPUT,
      message: err.message
    });
  }

  // Handle Sequelize errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = Object.keys(err.fields)[0];
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      code: ERROR_CODES.VALIDATION_ERROR,
      message: `${field} must be unique`,
      details: {
        field,
        message: `${field} already exists`
      }
    });
  }

  if (err.name === 'SequelizeValidationError') {
    const error = err.errors[0];
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      code: ERROR_CODES.VALIDATION_ERROR,
      message: MESSAGES.INVALID_REQUEST,
      details: {
        field: error.path,
        message: error.message
      }
    });
  }

  // Handle not found errors
  if (err.statusCode === HTTP_STATUS.NOT_FOUND) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      code: ERROR_CODES.NOT_FOUND,
      message: err.message || MESSAGES.INVALID_REQUEST
    });
  }

  // Default error response
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    status: 'error',
    code: err.code || ERROR_CODES.INTERNAL_ERROR,
    message: err.message || MESSAGES.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
