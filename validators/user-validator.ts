import Joi from "joi";

export const UserValidator = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
