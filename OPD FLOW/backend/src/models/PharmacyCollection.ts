// models/pharmacy/PharmacyCollection.ts  ->  collection: opd_pharmacy_collections
// The "Medicine Collected" record: written once, when pharmacy staff tap
// "Mark as collected". One record per prescription.
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPharmacyCollection extends Document {
  prescriptionId: Types.ObjectId;
  patientId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  pharmacyToken?: number;
  counterId?: Types.ObjectId;
  counterNo?: string;
  collectedAt: Date;
  collectedBy: {
    type: "PATIENT" | "CAREGIVER" | "REPRESENTATIVE";
    name?: string;
    nic?: string;
    relationship?: string;
  };
  issuedBy: Types.ObjectId; // pharmacy staff who handed over the medicine
  verificationMethod: "NIC" | "TOKEN" | "QR";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicineCollectionSchema = new Schema<IPharmacyCollection>(
  {
    // unique -> a prescription can only be collected once
    prescriptionId: { type: Schema.Types.ObjectId, ref: "PharmacyPrescription", required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    pharmacyToken: Number,
    counterId: { type: Schema.Types.ObjectId, ref: "PharmacyCounter" },
    counterNo: String,
    collectedAt: { type: Date, default: Date.now, required: true },
    collectedBy: {
      type: { type: String, enum: ["PATIENT", "CAREGIVER", "REPRESENTATIVE"], default: "PATIENT" },
      name: String,
      nic: String,
      relationship: String,
    },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verificationMethod: { type: String, enum: ["NIC", "TOKEN", "QR"], default: "TOKEN" },
    notes: String,
  },
  { timestamps: true, collection: "opd_pharmacy_collections" }
);

medicineCollectionSchema.index({ patientId: 1, collectedAt: -1 });
medicineCollectionSchema.index({ hospitalId: 1, collectedAt: -1 });

const PharmacyCollection = mongoose.model<IPharmacyCollection>("PharmacyCollection", medicineCollectionSchema);
export default PharmacyCollection;
