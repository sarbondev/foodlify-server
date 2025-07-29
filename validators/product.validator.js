const Joi = require("joi");

const createProductSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().min(4).required(),
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  previewImage: Joi.string().uri().required(),
  priceCard: Joi.number().min(0).required(),
  priceRegular: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  category: Joi.string().hex().length(24).required(),
  weight: Joi.number().positive().required(),
  stock: Joi.number().min(0).default(0),
});

const updateProductSchema = Joi.object({
  title: Joi.string().min(2),
  description: Joi.string().min(4),
  images: Joi.array().items(Joi.string().uri()),
  previewImage: Joi.string().uri(),
  priceCard: Joi.number().min(0),
  priceRegular: Joi.number().min(0),
  discount: Joi.number().min(0).max(100),
  category: Joi.string().hex().length(24),
  weight: Joi.number().positive(),
  stock: Joi.number().min(0),
});

module.exports = { createProductSchema, updateProductSchema };
