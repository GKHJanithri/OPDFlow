// models/Message.ts  ->  collection: opd_messages
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: string;
  body: string;
  attachments: { url: string; fileName?: string }[];
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, required: true },
    body: { type: String, required: true, maxlength: 2000 },
    attachments: [{ _id: false, url: { type: String, required: true }, fileName: String }],
    readAt: Date,
  },
  { timestamps: true, collection: "opd_messages" }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
