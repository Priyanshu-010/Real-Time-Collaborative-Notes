import Note from "../models/note.model.js";
import { canEditNote } from "../utils/permission.utils.js";

const registerNoteSocket = (socket) => {

  const currentUser = socket.user;

  socket.on("join-note", async ({ noteId }) => {
    socket.join(noteId);
    console.log(`User ${currentUser.name} joined note ${noteId}`);
  });


  socket.on("leave-note", ({ noteId }) => {
    socket.leave(noteId);
    console.log(`User left room: ${noteId}`);
  });


  socket.on("note-update", async ({ noteId, content }) => {
    try {
      const note = await Note.findById(noteId);
      if (!note) return;

      if (!canEditNote(note, currentUser._id)) return;

      socket.to(noteId).emit("receive-update", {
        content,
        userId: currentUser._id
      });

      console.log("Received update:", content);
      note.content = content;
      await note.save();
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
