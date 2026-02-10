const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Name cannot be empty',
      'string.max': 'Name cannot exceed 255 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    })
});

const updateUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .messages({
      'string.empty': 'Name cannot be empty',
      'string.max': 'Name cannot exceed 255 characters'
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .messages({
      'string.email': 'Email must be a valid email address'
    })
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema
};
