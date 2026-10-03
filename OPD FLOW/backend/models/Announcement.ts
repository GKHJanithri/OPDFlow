// models/Announcement.ts  ->  collection: opd_announcements
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAnnouncement extends Document {
  hospitalId?: Types.ObjectId | null; // null = all hospitals
  title: string;
  description: string;
  category: "GENERAL" | "URGENT" | "SERVICE_UPDATE" | "HOLIDAY";
  priority: "LOW" | "NORMAL" | "HIGH";
  audienceRoles: string[]; // empty = everyone
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  publishAt?: Date;
  expiresAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["GENERAL", "URGENT", "SERVICE_UPDATE", "HOLIDAY"], default: "GENERAL" },
    priority: { type: String, enum: ["LOW", "NORMAL", "HIGH"], default: "NORMAL" },
    audienceRoles: [String],
    status: { type: String, enum: ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"], default: "DRAFT" },
    publishAt: Date,
    expiresAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "opd_announcements" }
);

announcementSchema.index({ hospitalId: 1, status: 1, publishAt: -1 });

const Announcement = mongoose.model<IAnnouncement>("Announcement", announcementSchema);
export default Announcement;
