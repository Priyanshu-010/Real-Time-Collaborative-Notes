import Note from "../models/note.model.js";

export const canReadNote = async (note, userId) => {
  if (note.owner.toString() === userId.toString()) return true;

  const collaborator = await Note.collaborators.find(
    (c) =>
      c.user.toString() === userId.toString() &&
      c.status === "accepted"
  );

  return !!collaborator
};

export const canEditNote = (note, userId) => {
  if (note.owner.toString() === userId.toString()) return true;

  const collaborator = note.collaborators.find(
    (c) =>
      c.user.toString() === userId.toString() &&
      c.status === "accepted" &&
      c.permission === "edit"
  );

  return !!collaborator;
};

export const isOwner = (note, userId) => {
  return note.owner.toString() === userId.toString();
};
