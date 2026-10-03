// models/Counter.ts  ->  collection: opd_counters
// Atomic number generator. Example:
//   const c = await Counter.findOneAndUpdate(
//     { _id: `token:${doctorId}:2026-10-02` },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   c.seq -> next token number
import mongoose, { Document, Schema } from "mongoose";

export interface ICounter extends Document<string> {
  seq: number;
  createdAt: Date;
  updatedAt: Date;
}

const counterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "opd_counters" }
);

const Counter = mongoose.model<ICounter>("Counter", counterSchema);
export default Counter;
