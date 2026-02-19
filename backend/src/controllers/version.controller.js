import Note from "../models/note.model.js"
import Version from "../models/version.model.js"
import { canReadNote } from "../utils/permission.utils.js";

export const getVersionsByNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!canReadNote(note, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const versions = await Version.find({ noteId })
      .populate("editedBy", "name email")
      .sort({ versionNumber: -1 });

    res.status(200).json(versions);

  } catch (error) {
    console.log("Error in getVersionByNote controller: ", error)
    res.status(500).json({ message: "Failed to fetch versions" });
  }
};