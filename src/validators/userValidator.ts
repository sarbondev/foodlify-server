import Joi from "joi";

export const userValidator = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
