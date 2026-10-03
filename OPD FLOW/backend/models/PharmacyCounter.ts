// models/pharmacy/PharmacyCounter.ts  ->  collection: opd_pharmacy_counters
// Physical collection counters in the hospital pharmacy ("Counter Details" screen).
// NOT the same as opd_counters (that one is the number generator).
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPharmacyCounter extends Document {
  hospitalId: Types.ObjectId;
  counterNo: string; // e.g. "01"
  label: string; // e.g. "Prescription Collection"
  location?: string; // e.g. "Main OPD Pharmacy - Ground Floor"
  workingHours?: { openTime: string; closeTime: string }; // HH:mm
  status: "ACTIVE" | "CLOSED" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

const pharmacyCounterSchema = new Schema<IPharmacyCounter>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    counterNo: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    location: String,
    workingHours: { openTime: String, closeTime: String },
    status: { type: String, enum: ["ACTIVE", "CLOSED", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true, collection: "opd_pharmacy_counters" }
);

pharmacyCounterSchema.index({ hospitalId: 1, counterNo: 1 }, { unique: true });

const PharmacyCounter = mongoose.model<IPharmacyCounter>("PharmacyCounter", pharmacyCounterSchema);
export default PharmacyCounter;
