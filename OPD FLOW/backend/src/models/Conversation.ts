// models/Conversation.ts  ->  collection: opd_conversations
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  hospitalId: Types.ObjectId;
  patientUserId: Types.ObjectId;
  staffUserId?: Types.ObjectId; // empty until a staff member picks it up
  subject?: string;
  status: "OPEN" | "CLOSED";
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCountPatient: number;
  unreadCountStaff: number;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    patientUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    staffUserId: { type: Schema.Types.ObjectId, ref: "User" },
    subject: String,
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    lastMessage: String,
    lastMessageAt: Date,
    unreadCountPatient: { type: Number, default: 0 },
    unreadCountStaff: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "opd_conversations" }
);

conversationSchema.index({ patientUserId: 1, lastMessageAt: -1 });
conversationSchema.index({ hospitalId: 1, status: 1, lastMessageAt: -1 });

const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);
export default Conversation;
