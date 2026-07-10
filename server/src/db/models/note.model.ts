import mongoose, { type InferSchemaType } from "mongoose";
const noteSchema = new mongoose.Schema(
  {
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
type note = InferSchemaType<typeof noteSchema>;
export default mongoose.model<note>("Note", noteSchema);
