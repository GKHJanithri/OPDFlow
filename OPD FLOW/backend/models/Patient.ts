// models/Patient.ts  ->  collection: opd_patients
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPatient extends Document {
  patientNo: string; // e.g. OPD-2026-000123 (generated from opd_counters)
  userId?: Types.ObjectId; // null for walk-in patients without an app account
  hospitalId?: Types.ObjectId;
  registeredBy?: Types.ObjectId;
  fullName: string;
  nic?: string;
  dateOfBirth?: Date;
  gender?: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  address?: { line1?: string; city?: string; district?: string };
  emergencyContact?: { name?: string; phone?: string; relationship?: string };
  medicalNotes?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    patientNo: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital" },
    registeredBy: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true, trim: true },
    nic: { type: String, unique: true, sparse: true, trim: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    phone: { type: String, trim: true, index: true },
    address: { line1: String, city: String, district: String },
    emergencyContact: { name: String, phone: String, relationship: String },
    medicalNotes: String,
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true, collection: "opd_patients" }
);

const Patient = mongoose.model<IPatient>("Patient", patientSchema);
export default Patient;
