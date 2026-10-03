// models/Doctor.ts  ->  collection: opd_doctors
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IDoctor extends Document {
  userId?: Types.ObjectId; // the doctor's login account
  hospitalId: Types.ObjectId;
  fullName: string;
  specialization?: string; // optional, NOT a department
  qualifications: string[];
  experienceYears?: number;
  bio?: string;
  photoUrl?: string;
  consultationRoom?: string;
  avgConsultMinutes: number; // used for waiting-time estimates
  averageRating: number;
  ratingCount: number;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    specialization: String,
    qualifications: [String],
    experienceYears: { type: Number, min: 0 },
    bio: String,
    photoUrl: String,
    consultationRoom: String,
    avgConsultMinutes: { type: Number, default: 10, min: 1 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["ACTIVE", "ON_LEAVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true, collection: "opd_doctors" }
);

const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
export default Doctor;
