// models/QueueEntry.ts  ->  collection: opd_queue_entries
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IQueueEntry extends Document {
  queueId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  tokenNumber: number;
  queuePosition: number;
  status: "WAITING" | "CALLED" | "IN_CONSULTATION" | "COMPLETED" | "SKIPPED" | "NO_SHOW" | "CANCELLED";
  checkedInAt?: Date;
  calledAt?: Date;
  consultStartAt?: Date;
  consultEndAt?: Date;
  consultationNotes?: string;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const queueEntrySchema = new Schema<IQueueEntry>(
  {
    queueId: { type: Schema.Types.ObjectId, ref: "Queue", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    tokenNumber: { type: Number, required: true },
    queuePosition: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["WAITING", "CALLED", "IN_CONSULTATION", "COMPLETED", "SKIPPED", "NO_SHOW", "CANCELLED"],
      default: "WAITING",
    },
    checkedInAt: Date,
    calledAt: Date,
    consultStartAt: Date,
    consultEndAt: Date,
    consultationNotes: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "opd_queue_entries" }
);

queueEntrySchema.index({ queueId: 1, tokenNumber: 1 }, { unique: true });
queueEntrySchema.index({ queueId: 1, status: 1, tokenNumber: 1 });

const QueueEntry = mongoose.model<IQueueEntry>("QueueEntry", queueEntrySchema);
export default QueueEntry;
