import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["read", "edit"],
          default: "read",
        },
        status: {
          type: String,
          enum: ["pending", "accepted"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
