const Joi = require('joi');

const createMeetingSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'User ID must be a valid UUID',
      'any.required': 'User ID is required'
    }),

  title: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 255 characters',
      'any.required': 'Title is required'
    }),

  startTime: Joi.date()
    .iso()
    .required()
    .messages({
      'date.iso': 'Start time must be a valid ISO 8601 date',
      'any.required': 'Start time is required'
    }),

  endTime: Joi.date()
    .iso()
    .required()
    .messages({
      'date.iso': 'End time must be a valid ISO 8601 date',
      'any.required': 'End time is required'
    })
}).external(async (value) => {
  if (value.startTime >= value.endTime) {
    throw new Error('Start time must be before end time');
  }
});

const updateMeetingSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 255 characters'
    }),

  startTime: Joi.date()
    .iso()
    .messages({
      'date.iso': 'Start time must be a valid ISO 8601 date'
    }),

  endTime: Joi.date()
    .iso()
    .messages({
      'date.iso': 'End time must be a valid ISO 8601 date'
    })
}).min(1).external(async (value) => {
  if (value.startTime && value.endTime && value.startTime >= value.endTime) {
    throw new Error('Start time must be before end time');
  }
});

module.exports = {
  createMeetingSchema,
  updateMeetingSchema
};
