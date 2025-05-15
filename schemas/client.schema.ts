import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "client" },
});

export default mongoose.model("ClientSchema", ClientSchema);
