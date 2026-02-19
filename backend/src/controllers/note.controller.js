import Note from "../models/note.model.js";
import User from "../models/user.model.js";
import Version from "../models/version.model.js";
import { canEditNote, canReadNote, isOwner } from "../utils/permission.utils.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content: content || "",
      owner: req.user._id,
    });

    await Version.create({
      noteId: note._id,
      content: note.content || "",
      editedBy: req.user._id,
      versionNumber: 1,
    });

    res.status(200).json(note);
  } catch (error) {
    console.log("Error in createNote controller: ", error);
  }
};

export const getNotes = async (req, res) => {
  try {
     const notes = await Note.find({
      $or: [
        { owner: req.user._id },
        {
          "collaborators.user": req.user._id,
          "collaborators.status": "accepted",
        },
      ],
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
    console.log("Error in getNotes controller: ", error);
  }
};

export const getNotesById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!canReadNote(note, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(note);
  } catch (error) {
    console.log("Error in getNotesById controller: ", error);
    res.status(500).json({ message: "Failed to fetch note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { content } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(400).json({ message: "Note not found" });
    }

    if (!canEditNote(note, req.user._id)) {
      return res.status(403).json({ message: "No edit permission" });
    }

    if (note.content !== content) {
      const latestversion = await Version.findOne({ noteId: note._id }).sort({
        versionNumber: -1,
      });

      const newVersionNumber = latestversion
        ? latestversion.versionNumber + 1
        : 1;

        await Version.create({
          noteId: note._id,
          content,
          editedBy: req.user._id,
          versionNumber: newVersionNumber
        })

        note.content = content
        await note.save();
    }

    res.status(200).json(note)
  } catch (error) {
    console.log("Error in updateNote controller: ", error);
    res.status(500).json({ message: "Failed to update note" });
  }
};


export const deleteNote = async(req, res) =>{
  try {
    const note = await Note.findById(req.params.id)

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!isOwner(note, req.user._id)) {
      return res.status(403).json({ message: "Only owner can delete" });
    }

    await note.deleteOne()

    res.status(200).json({message: "Note Deleted"})
  } catch (error) {
    console.log("Error in deleteNote controller: ", error)
    res.status(500).json({ message: "Failed to delete note" });
  }
}

export const inviteCollaborator = async (req, res)=>{
  try {
    const { email, permission } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!isOwner(note, req.user._id)) {
      return res.status(403).json({ message: "Only owner can invite" });
    }

    const user = await User.findOne({ email });
    if (!user){
      return res.status(404).json({ message: "User not found" });
    }

    note.collaborators.push({
      user: user._id,
      permission: permission || "read",
      status: "pending"
    });

    await note.save();

    res.status(200).json({message: "Invitation Sent"})

  } catch (error) {
    console.log("Error in inviteCollaborator controller: ", error)
    res.status(500).json({ message: "Failed to invite" });
  }
}

export const acceptInvite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note){
      return res.status(404).json({ message: "Note not found" });
    }

    const collaborator = note.collaborators.find(
      (c) =>
        c.user.toString() === req.user._id.toString() &&
        c.status === "pending"
    );

    if (!collaborator) {
      return res.status(400).json({ message: "No pending invite found" });
    }

    collaborator.status = "accepted";
    await note.save();

    res.status(200).json({ message: "Invitation accepted" });

  } catch (error) {
    console.log("Error in acceptInvite controller: ", error)
    res.status(500).json({ message: "Failed to accept invite" });
  }
};