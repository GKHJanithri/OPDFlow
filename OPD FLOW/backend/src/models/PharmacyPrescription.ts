// models/pharmacy/PharmacyPrescription.ts  ->  collection: opd_pharmacy_prescriptions
// Created by the doctor after a consultation. The pharmacy then prepares it
// (PENDING -> PREPARING -> READY) and hands it over (COLLECTED).
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPharmacyPrescriptionItem {
  medicineName: string;
  dosage?: string; // e.g. "500mg"
  frequency?: string; // e.g. "3 times a day"
  duration?: string; // e.g. "5 days"
  quantity?: number;
}

export const PHARMACY_PRESCRIPTION_STATUSES = ["PENDING", "PREPARING", "READY", "COLLECTED", "CANCELLED"] as const;

export interface IPharmacyPrescription extends Document {
  prescriptionNo: string; // e.g. RX-2048 (generate from opd_counters)
  hospitalId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  items: IPharmacyPrescriptionItem[];
  doctorNotes?: string;
  status: (typeof PHARMACY_PRESCRIPTION_STATUSES)[number];
  pharmacyQueueId?: Types.ObjectId;
  pharmacyToken?: number; // assigned when sent to the pharmacy queue
  counterId?: Types.ObjectId;
  counterNo?: string; // copied from the counter for quick display
  preparedBy?: Types.ObjectId; // pharmacy staff who prepared it
  readyAt?: Date;
  collectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionSchema = new Schema<IPharmacyPrescription>(
  {
    prescriptionNo: { type: String, required: true, unique: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    items: {
      type: [
        {
          _id: false,
          medicineName: { type: String, required: true, trim: true },
          dosage: String,
          frequency: String,
          duration: String,
          quantity: { type: Number, min: 1 },
        },
      ],
      validate: { validator: (v: unknown[]) => v.length > 0, message: "A prescription needs at least one medicine" },
    },
    doctorNotes: String,
    status: { type: String, enum: PHARMACY_PRESCRIPTION_STATUSES, default: "PENDING" },
    pharmacyQueueId: { type: Schema.Types.ObjectId, ref: "PharmacyQueue" },
    pharmacyToken: Number,
    counterId: { type: Schema.Types.ObjectId, ref: "PharmacyCounter" },
    counterNo: String,
    preparedBy: { type: Schema.Types.ObjectId, ref: "User" },
    readyAt: Date,
    collectedAt: Date,
  },
  { timestamps: true, collection: "opd_pharmacy_prescriptions" }
);

prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ appointmentId: 1 });
prescriptionSchema.index({ hospitalId: 1, status: 1, createdAt: -1 }); // pharmacy dashboard lists
// token is unique inside one pharmacy queue (only for prescriptions that have a token)
prescriptionSchema.index(
  { pharmacyQueueId: 1, pharmacyToken: 1 },
  { unique: true, partialFilterExpression: { pharmacyToken: { $type: "number" } } }
);

const PharmacyPrescription = mongoose.model<IPharmacyPrescription>("PharmacyPrescription", prescriptionSchema);
export default PharmacyPrescription;
