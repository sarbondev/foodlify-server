import mongoose from "mongoose";

const SuperAdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "super-admin" },
});

export default mongoose.model("SuperAdminSchema", SuperAdminSchema);
