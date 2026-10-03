// models/CaregiverLink.ts  ->  collection: opd_caregiver_links
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICaregiverLink extends Document {
  caregiverUserId: Types.ObjectId;
  patientId: Types.ObjectId;
  relationship?: string;
  permissions: { canBook: boolean; canCancel: boolean; canReschedule: boolean };
  status: "PENDING" | "APPROVED" | "REVOKED";
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const caregiverLinkSchema = new Schema<ICaregiverLink>(
  {
    caregiverUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    relationship: String,
    permissions: {
      canBook: { type: Boolean, default: true },
      canCancel: { type: Boolean, default: true },
      canReschedule: { type: Boolean, default: true },
    },
    status: { type: String, enum: ["PENDING", "APPROVED", "REVOKED"], default: "PENDING" },
    approvedAt: Date,
  },
  { timestamps: true, collection: "opd_caregiver_links" }
);

caregiverLinkSchema.index({ caregiverUserId: 1, patientId: 1 }, { unique: true });

const CaregiverLink = mongoose.model<ICaregiverLink>("CaregiverLink", caregiverLinkSchema);
export default CaregiverLink;
