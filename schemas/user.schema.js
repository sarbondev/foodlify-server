const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },
  isActive: { type: Boolean, default: true },
});

module.exports = model("User", UserSchema);
