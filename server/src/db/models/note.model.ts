import mongoose, { type InferSchemaType } from "mongoose";
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
export type NoteType = InferSchemaType<typeof noteSchema>;
export default mongoose.model<NoteType>("Note", noteSchema);
