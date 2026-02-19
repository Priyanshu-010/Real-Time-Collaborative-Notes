import express from "express";
import { protect } from "../middleware/auth.middleware.js"
import { getVersionsByNote } from "../controllers/version.controller.js";

const router = express.Router();

router.get("/:noteId", protect, getVersionsByNote);

export default router;
