const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  image: Joi.string().uri().required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50),
  image: Joi.string().uri(),
});

module.exports = { createCategorySchema, updateCategorySchema };
