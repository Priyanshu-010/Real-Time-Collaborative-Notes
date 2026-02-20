import axiosInstance from "./axios";

export const getNotes = () => {
  return axiosInstance.get("/notes");
};

// Get single note
export const getNoteById = (id) => {
  return axiosInstance.get(`/notes/${id}`);
};

// Create note
export const createNote = (data) => {
  return axiosInstance.post("/notes", data);
};

// Update note
export const updateNote = (id, data) => {
  return axiosInstance.put(`/notes/${id}`, data);
};

// Delete note
export const deleteNote = (id) => {
  return axiosInstance.delete(`/notes/${id}`);
};

//Invite Collaborator
export const inviteCollaborator = (id, data) =>{
  return axiosInstance.post(`/notes/${id}/invite`, data);
}

//Accept Invite
export const acceptInvite = (id) =>{
  return axiosInstance.post(`/notes/${id}/accept`);
}