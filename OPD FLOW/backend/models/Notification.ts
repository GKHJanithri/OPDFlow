// models/Notification.ts  ->  collection: opd_notifications
import mongoose, { Document, Schema, Types } from "mongoose";

export const NOTIFICATION_TYPES = [
  "APPOINTMENT_CONFIRMED",
  "REMINDER",
  "QUEUE_UPDATE",
  "TOKEN_UPDATE",
  "DELAY",
  "NEAR_TURN",
  "CANCELLED",
  "RESCHEDULED",
  "ANNOUNCEMENT",
] as const;

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: (typeof NOTIFICATION_TYPES)[number];
  title: string;
  message: string;
  channel: "IN_APP" | "PUSH" | "SMS";
  relatedAppointmentId?: Types.ObjectId;
  relatedQueueId?: Types.ObjectId;
  relatedAnnouncementId?: Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  deliveryStatus: "PENDING" | "SENT" | "FAILED";
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ["IN_APP", "PUSH", "SMS"], default: "IN_APP" },
    relatedAppointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    relatedQueueId: { type: Schema.Types.ObjectId, ref: "Queue" },
    relatedAnnouncementId: { type: Schema.Types.ObjectId, ref: "Announcement" },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    deliveryStatus: { type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" },
    scheduledFor: Date,
    sentAt: Date,
  },
  { timestamps: true, collection: "opd_notifications" }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ deliveryStatus: 1, scheduledFor: 1 }); // reminder job

const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;
