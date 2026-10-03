// models/DoctorSchedule.ts  ->  collection: opd_doctor_schedules
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISlot {
  slotId: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  capacity: number;
  bookedCount: number;
  status: "AVAILABLE" | "FULL" | "BLOCKED";
}

export interface IDoctorSchedule extends Document {
  doctorId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  scheduleDate: Date;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  slots: ISlot[];
  status: "OPEN" | "FULL" | "CANCELLED" | "LEAVE";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorScheduleSchema = new Schema<IDoctorSchedule>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    scheduleDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDurationMinutes: { type: Number, default: 15, min: 1 },
    slots: [
      {
        _id: false,
        slotId: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        capacity: { type: Number, default: 1, min: 1 },
        bookedCount: { type: Number, default: 0, min: 0 },
        status: { type: String, enum: ["AVAILABLE", "FULL", "BLOCKED"], default: "AVAILABLE" },
      },
    ],
    status: { type: String, enum: ["OPEN", "FULL", "CANCELLED", "LEAVE"], default: "OPEN" },
    notes: String,
  },
  { timestamps: true, collection: "opd_doctor_schedules" }
);

doctorScheduleSchema.index({ doctorId: 1, scheduleDate: 1, startTime: 1 }, { unique: true });
doctorScheduleSchema.index({ hospitalId: 1, scheduleDate: 1 });

const DoctorSchedule = mongoose.model<IDoctorSchedule>("DoctorSchedule", doctorScheduleSchema);
export default DoctorSchedule;
