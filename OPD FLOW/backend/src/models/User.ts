// models/User.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email?: string;
  passwordHash?: string;
  role:
    | "PATIENT"
    | "CAREGIVER"
    | "REGISTRATION_OFFICER"
    | "DOCTOR"
    | "NURSE"
    | "ADMIN"
    | "PHARMACY_STAFF";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
    },

    role: {
      type: String,
      enum: [
        "PATIENT",
        "CAREGIVER",
        "REGISTRATION_OFFICER",
        "DOCTOR",
        "NURSE",
        "ADMIN",
        "PHARMACY_STAFF",
      ],
      default: "PATIENT",
    },
  },
  {
    timestamps: true,
    collection: "opd_users",
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;