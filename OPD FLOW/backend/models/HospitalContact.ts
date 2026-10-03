// models/HospitalContact.ts  ->  collection: opd_hospital_contacts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IHospitalContact extends Document {
  hospitalId: Types.ObjectId;
  contactType: "GENERAL" | "EMERGENCY" | "REGISTRATION" | "PHARMACY" | "ENQUIRY";
  label: string;
  personName?: string;
  designation?: string;
  phone?: string;
  extension?: string;
  email?: string;
  availableHours?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hospitalContactSchema = new Schema<IHospitalContact>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    contactType: {
      type: String,
      enum: ["GENERAL", "EMERGENCY", "REGISTRATION", "PHARMACY", "ENQUIRY"],
      default: "GENERAL",
    },
    label: { type: String, required: true },
    personName: String,
    designation: String,
    phone: String,
    extension: String,
    email: { type: String, lowercase: true },
    availableHours: String,
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "opd_hospital_contacts" }
);

const HospitalContact = mongoose.model<IHospitalContact>("HospitalContact", hospitalContactSchema);
export default HospitalContact;
