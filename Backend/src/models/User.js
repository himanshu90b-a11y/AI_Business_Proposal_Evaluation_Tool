import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 254 },
    passwordHash: { type: String, required: true },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      theme: { type: String, enum: ["light", "dark"], default: "light" }
    }
  },
  { timestamps: true, versionKey: false }
);

export const User = mongoose.model("User", userSchema);
