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
    if (!title || !content) return toast.error("All fields are required");
    try {
      await createNote({ title, content });
      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      console.log(error)
      toast.error("Failed to create note");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl space-y-8">
        <h2 className="text-3xl font-bold text-white">New Workspace Note</h2>
        
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Title of your note..."
            className="w-full bg-transparent text-3xl font-bold border-b border-slate-800 focus:border-indigo-500 outline-none pb-4 transition-colors placeholder:text-slate-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows="12"
            placeholder="Start typing your ideas here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-lg text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20">
            Save Note
          </button>
          <button type="button" onClick={() => navigate("/")} className="px-8 bg-slate-800 text-slate-300 rounded-2xl font-semibold hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;