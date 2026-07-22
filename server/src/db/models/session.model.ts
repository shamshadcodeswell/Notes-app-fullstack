import mongoose, { type InferSchemaType } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    refreshTokenHash: {
      type: String,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export type sessionType = InferSchemaType<typeof sessionSchema>;
export default mongoose.model("Session", sessionSchema);
