const Joi = require('joi');

exports.createProductSchema = Joi.object({
  title:       Joi.string().min(3).max(100).required(),
  type:        Joi.string().valid('Digital Product', 'Physical Product').required(),
  sku:         Joi.string().min(2).max(50).required(),
  brand:       Joi.string().min(2).max(50).required(),
  description: Joi.string().min(10).required(),
  price:       Joi.number().positive().required(),
  category:    Joi.string().required(),
  image:       Joi.string().required(),
});

exports.updateProductSchema = Joi.object({
  title:       Joi.string().min(3).max(100).required(),
  type:        Joi.string().valid('Digital Product', 'Physical Product').required(),
  sku:         Joi.string().min(2).max(50).required(),
  brand:       Joi.string().min(2).max(50).required(),
  description: Joi.string().min(10).required(),
  price:       Joi.number().positive().required(),
  category:    Joi.string().required(),
  image:       Joi.string().optional(),
});


