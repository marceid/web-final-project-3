const Joi = require('joi');

exports.registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
    'string.empty': 'Password is required.',
    'string.pattern.base':
      'Password must be 3 to 30 characters long and contain only letters and numbers.',
    'any.required': 'Password is required.',
  }),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: {allow: ['com', 'net']},
  }),
});


exports.loginSchema = Joi.object({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
    'string.empty': 'Password is required.',
    'string.pattern.base':
      'Password must be 3 to 30 characters long and contain only letters and numbers.',
    'any.required': 'Password is required.',
  }),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: {allow: ['com', 'net']},
  }),
});

