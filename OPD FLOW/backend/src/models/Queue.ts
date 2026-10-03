// models/Queue.ts  ->  collection: opd_queues  (one queue per doctor per day)
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IQueue extends Document {
  hospitalId: Types.ObjectId;
  doctorId: Types.ObjectId;
  scheduleId: Types.ObjectId;
  queueDate: Date;
  currentToken: number;
  lastIssuedToken: number;
  status: "NOT_STARTED" | "ACTIVE" | "PAUSED" | "CLOSED";
  avgConsultMinutes: number;
  estimatedWaitMinutes: number;
  delayMinutes: number;
  delayReason?: string;
  startedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const queueSchema = new Schema<IQueue>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: "DoctorSchedule", required: true },
    queueDate: { type: Date, required: true },
    currentToken: { type: Number, default: 0 },
    lastIssuedToken: { type: Number, default: 0 },
    status: { type: String, enum: ["NOT_STARTED", "ACTIVE", "PAUSED", "CLOSED"], default: "NOT_STARTED" },
    avgConsultMinutes: { type: Number, default: 10 },
    estimatedWaitMinutes: { type: Number, default: 0 },
    delayMinutes: { type: Number, default: 0 },
    delayReason: String,
    startedAt: Date,
    closedAt: Date,
  },
  { timestamps: true, collection: "opd_queues" }
);

queueSchema.index({ doctorId: 1, queueDate: 1 }, { unique: true });

const Queue = mongoose.model<IQueue>("Queue", queueSchema);
export default Queue;
