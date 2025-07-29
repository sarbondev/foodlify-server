const Joi = require("joi");

const createLocationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  coordinates: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  address: Joi.string().min(5).max(200).required(),
});

const updateLocationSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  coordinates: Joi.object({
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
  }),
  address: Joi.string().min(5).max(200),
});

module.exports = { createLocationSchema, updateLocationSchema };
