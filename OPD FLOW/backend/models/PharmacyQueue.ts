// models/pharmacy/PharmacyQueue.ts  ->  collection: opd_pharmacy_queues
// One pharmacy queue per hospital per day ("Pharmacy Queue" screen).
// Each prescription holds its own pharmacyToken; patients ahead =
// prescriptions in this queue (PENDING / PREPARING / READY) with a lower token.
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPharmacyQueue extends Document {
  hospitalId: Types.ObjectId;
  queueDate: Date;
  currentToken: number; // token now being served at the counter
  lastIssuedToken: number;
  status: "NOT_STARTED" | "ACTIVE" | "PAUSED" | "CLOSED";
  avgServiceMinutes: number; // used for waiting-time estimate
  estimatedWaitMinutes: number;
  startedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pharmacyQueueSchema = new Schema<IPharmacyQueue>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    queueDate: { type: Date, required: true },
    currentToken: { type: Number, default: 0 },
    lastIssuedToken: { type: Number, default: 0 },
    status: { type: String, enum: ["NOT_STARTED", "ACTIVE", "PAUSED", "CLOSED"], default: "NOT_STARTED" },
    avgServiceMinutes: { type: Number, default: 5, min: 1 },
    estimatedWaitMinutes: { type: Number, default: 0 },
    startedAt: Date,
    closedAt: Date,
  },
  { timestamps: true, collection: "opd_pharmacy_queues" }
);

pharmacyQueueSchema.index({ hospitalId: 1, queueDate: 1 }, { unique: true });

const PharmacyQueue = mongoose.model<IPharmacyQueue>("PharmacyQueue", pharmacyQueueSchema);
export default PharmacyQueue;
