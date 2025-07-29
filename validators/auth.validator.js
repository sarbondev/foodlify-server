const Joi = require("joi");

const signUpSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "staff", "user").default("user"),
});

const signInSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  password: Joi.string().required(),
});

module.exports = { signInSchema, signUpSchema };
