import Joi from "joi";

export const clientValidator = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
