// models/Rating.ts  ->  collection: opd_ratings
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRating extends Document {
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  rating: number; // 1-5
  review?: string;
  status: "VISIBLE" | "HIDDEN" | "FLAGGED";
  moderatedBy?: Types.ObjectId;
  moderationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    // unique -> one rating per appointment
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: { validator: Number.isInteger, message: "Rating must be a whole number from 1 to 5" },
    },
    review: { type: String, maxlength: 500, trim: true },
    status: { type: String, enum: ["VISIBLE", "HIDDEN", "FLAGGED"], default: "VISIBLE" },
    moderatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    moderationNote: String,
  },
  { timestamps: true, collection: "opd_ratings" }
);

const Rating = mongoose.model<IRating>("Rating", ratingSchema);
export default Rating;
