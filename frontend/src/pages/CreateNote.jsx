import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "../api/note.api.js";
import { toast } from "react-hot-toast";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return toast.error("All fields are required");
    }

    try {
      await createNote({ title, content });
      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      console.log("Error in handleSubmit CreateNote: ", error)
      toast.error("Failed to create note");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Note
        </h2>

        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Content</label>
          <textarea
            rows="6"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-semibold"
        >
          Create Note
        </button>
      </form>
    </div>
  );
};

export default CreateNote;