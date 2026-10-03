// models/AuditLog.ts  ->  collection: opd_audit_logs
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAuditLog extends Document {
  userId?: Types.ObjectId;
  role?: string;
  action: string; // CREATE, UPDATE, DELETE, LOGIN ...
  entity: string; // e.g. opd_patients
  entityId?: Types.ObjectId;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    role: String,
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId },
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: true, collection: "opd_audit_logs" }
);

auditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });

const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
export default AuditLog;
