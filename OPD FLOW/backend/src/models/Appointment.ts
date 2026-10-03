// models/Appointment.ts  ->  collection: opd_appointments
import mongoose, { Document, Schema, Types } from "mongoose";

export const APPOINTMENT_STATUSES = [
  "BOOKED",
  "CONFIRMED",
  "WAITING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
  "NO_SHOW",
] as const;

export interface IAppointment extends Document {
  appointmentNo: string; // e.g. APT-20261002-0007
  patientId: Types.ObjectId;
  bookedBy: Types.ObjectId;
  bookingSource: "APP" | "REGISTRATION_DESK";
  hospitalId: Types.ObjectId;
  doctorId: Types.ObjectId;
  scheduleId: Types.ObjectId;
  slotId: string;
  appointmentDate: Date;
  appointmentTime: string; // HH:mm
  tokenNumber: number;
  status: (typeof APPOINTMENT_STATUSES)[number];
  cancellationReason?: string;
  cancelledBy?: Types.ObjectId;
  cancelledAt?: Date;
  rescheduledFromId?: Types.ObjectId;
  remindersSent: { dayBefore: boolean; twoHours: boolean };
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    appointmentNo: { type: String, required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    bookedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingSource: { type: String, enum: ["APP", "REGISTRATION_DESK"], default: "APP" },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: "DoctorSchedule", required: true },
    slotId: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    tokenNumber: { type: Number, required: true },
    status: { type: String, enum: APPOINTMENT_STATUSES, default: "BOOKED" },
    cancellationReason: String,
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancelledAt: Date,
    rescheduledFromId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    remindersSent: {
      dayBefore: { type: Boolean, default: false },
      twoHours: { type: Boolean, default: false },
    },
    completedAt: Date,
  },
  { timestamps: true, collection: "opd_appointments" }
);

appointmentSchema.index({ scheduleId: 1, tokenNumber: 1 }, { unique: true });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, status: 1 });

const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);
export default Appointment;
