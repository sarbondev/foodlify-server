const { Schema, model } = require("mongoose");

const CoordinatesSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const LocationSchema = new Schema({
  name: { type: String, required: true },
  coordinates: CoordinatesSchema,
});

module.exports = model("Location", LocationSchema);
