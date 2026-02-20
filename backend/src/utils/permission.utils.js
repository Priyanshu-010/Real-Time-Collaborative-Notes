export const canReadNote = (note, userId) => {
  const ownerId = note.owner._id || note.owner;
  if (ownerId.toString() === userId.toString()) return true;

  const collaborator = note.collaborators.find(
    (c) => {
      const collabUserId = c.user._id || c.user;
      return collabUserId.toString() === userId.toString();
    }
  );

  return !!collaborator;
};

export const canEditNote = (note, userId) => {
  const ownerId = note.owner._id || note.owner;
  if (ownerId.toString() === userId.toString()) return true;

  const collaborator = note.collaborators.find(
    (c) => {
      const collabUserId = c.user._id || c.user;
      return (
        collabUserId.toString() === userId.toString() &&
        c.status === "accepted" &&
        c.permission === "edit"
      );
    }
  );

  return !!collaborator;
};

export const isOwner = (note, userId) => {
  const ownerId = note.owner._id || note.owner;
  return ownerId.toString() === userId.toString();
};