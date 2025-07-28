import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  phoneNumber: string
  password: string
  role: string
  isActive: boolean
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },
  isActive: { type: Boolean, default: true }
});

export default model<IUser>("User", UserSchema);
