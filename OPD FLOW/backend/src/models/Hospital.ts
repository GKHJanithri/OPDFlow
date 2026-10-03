// models/Hospital.ts  ->  collection: opd_hospitals
import mongoose, { Document, Schema } from "mongoose";

export interface IHospital extends Document {
  name: string;
  code: string;
  address?: { line1?: string; city?: string; district?: string; province?: string };
  location?: { type: "Point"; coordinates: [number, number] }; // [longitude, latitude]
  phone?: string;
  email?: string;
  description?: string;
  openingHours: { day: string; openTime: string; closeTime: string }[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

const hospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    address: {
      line1: String,
      city: String,
      district: String,
      province: String,
    },
    // optional GeoJSON point (no defaults, so hospitals without coordinates still save)
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], default: undefined },
    },
    phone: String,
    email: { type: String, lowercase: true },
    description: String,
    openingHours: [
      {
        _id: false,
        day: { type: String, required: true },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
      },
    ],
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true, collection: "opd_hospitals" }
);

hospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model<IHospital>("Hospital", hospitalSchema);
export default Hospital;
