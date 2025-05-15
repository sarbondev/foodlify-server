import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },
});

export default mongoose.model("StaffSchema", StaffSchema);
