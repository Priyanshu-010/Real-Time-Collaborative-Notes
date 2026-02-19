import Note from "../models/note.model.js";
import { canEditNote } from "../utils/permission.utils.js";

const registerNoteSocket = (io, socket) => {

  socket.on("join-note", async ({ noteId, userId }) => {
    socket.join(noteId);
    console.log(`User ${userId} joined note ${noteId}`);
  });


  socket.on("leave-note", ({ noteId }) => {
    socket.leave(noteId);
  });


  socket.on("note-update", async ({ noteId, content, userId }) => {
    try {
      const note = await Note.findById(noteId);
      if (!note) return;

      if (!canEditNote(note, userId)) return;

      socket.to(noteId).emit("receive-update", {
        content,
        userId
      });

    } catch (error) {
      console.error("Socket update error:", error.message);
    }
  });


  socket.on("typing", ({ noteId, userName }) => {
    socket.to(noteId).emit("user-typing", userName);
  });


  socket.on("stop-typing", ({ noteId }) => {
    socket.to(noteId).emit("user-stop-typing");
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

};

export default registerNoteSocket;
