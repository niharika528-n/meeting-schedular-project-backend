const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const validateRequest = (req, res, next) => {
  // Assign unique request ID
  req.id = uuidv4();

  // Validate Content-Type for POST, PUT, PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_CONTENT_TYPE',
        message: 'Content-Type must be application/json'
      });
    }
  }

  next();
};

module.exports = validateRequest;
