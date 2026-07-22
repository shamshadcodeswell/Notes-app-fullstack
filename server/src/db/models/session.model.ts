import mongoose, { type InferSchemaType } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    refresTokenHash: {
      type: String,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true },
);

export type sessionType = InferSchemaType<typeof sessionSchema>;
export default mongoose.model("Session", sessionSchema);
