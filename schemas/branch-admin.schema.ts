import mongoose from "mongoose";

const BranchAdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "branch-admin" },
});

export default mongoose.model("BranchAdminSchema", BranchAdminSchema);
