// models/AuthToken.ts  ->  collection: opd_auth_tokens
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAuthToken extends Document {
  userId: Types.ObjectId;
  purpose: "OTP_VERIFY" | "PASSWORD_RESET" | "EMAIL_VERIFY";
  codeHash: string;
  attempts: number;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const authTokenSchema = new Schema<IAuthToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    purpose: { type: String, enum: ["OTP_VERIFY", "PASSWORD_RESET", "EMAIL_VERIFY"], required: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    usedAt: Date,
  },
  { timestamps: true, collection: "opd_auth_tokens" }
);

// TTL: MongoDB deletes the document automatically once expiresAt has passed
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuthToken = mongoose.model<IAuthToken>("AuthToken", authTokenSchema);
export default AuthToken;
