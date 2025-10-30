import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  aadhaar_no: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", UserSchema);

