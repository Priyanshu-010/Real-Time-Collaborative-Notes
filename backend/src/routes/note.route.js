import express from "express"
import { acceptInvite, createNote, deleteNote, getNotes, getNotesById, inviteCollaborator, updateNote } from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/", protect, createNote)
router.get("/", protect, getNotes)
router.get("/:id", protect, getNotesById);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

router.post("/:id/invite", protect, inviteCollaborator);
router.post("/:id/accept", protect, acceptInvite);

export default router