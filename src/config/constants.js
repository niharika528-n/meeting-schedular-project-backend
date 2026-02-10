module.exports = {
  // API Configuration
  API_PREFIX: '/api',

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },

  // Error Codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SCHEDULING_CONFLICT: 'SCHEDULING_CONFLICT',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    MEETING_NOT_FOUND: 'MEETING_NOT_FOUND',
    INVALID_INPUT: 'INVALID_INPUT'
  },

  // Error Messages
  MESSAGES: {
    USER_CREATED: 'User created successfully',
    USER_FETCHED: 'User fetched successfully',
    USER_DELETED: 'User deleted successfully',
    USERS_FETCHED: 'Users fetched successfully',
    MEETING_CREATED: 'Meeting created successfully',
    MEETING_FETCHED: 'Meeting fetched successfully',
    MEETING_UPDATED: 'Meeting updated successfully',
    MEETING_DELETED: 'Meeting deleted successfully',
    MEETINGS_FETCHED: 'Meetings fetched successfully',
    TIME_SLOT_BOOKED: 'Time slot already booked',
    USER_NOT_FOUND: 'User not found',
    MEETING_NOT_FOUND: 'Meeting not found',
    INVALID_TIME_RANGE: 'Start time must be before end time',
    INVALID_REQUEST: 'Invalid request data',
    INTERNAL_ERROR: 'An unexpected error occurred'
  },

  // Validation Constants
  VALIDATION: {
    MIN_NAME_LENGTH: 1,
    MAX_NAME_LENGTH: 255,
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 255,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};
