import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    versionNumber: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Version = mongoose.model("Version", versionSchema);
export default Version;
