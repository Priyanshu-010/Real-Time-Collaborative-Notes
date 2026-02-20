import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNoteById, updateNote } from "../api/note.api.js";
import { toast } from "react-hot-toast";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await getNoteById(id);
        setTitle(data.title);
        setContent(data.content);
        setLoading(false);
      } catch (error) {
        console.log(error)
        toast.error("Failed to load note");
        navigate("/");
      }
    };
    fetchNote();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error("All fields are required");

    try {
      await updateNote(id, { title, content });
      toast.success("Changes saved successfully");
      navigate("/");
    } catch (error) {
      console.log(error)
      toast.error("Access Denied or Save Failed");
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500 text-xl animate-pulse">Loading editor...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Edit Note</h2>
          <p className="text-slate-500 mt-2">Modify your thoughts and save your progress.</p>
        </div>
        
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Note title..."
            className="w-full bg-transparent text-3xl font-bold border-b border-slate-800 focus:border-indigo-500 outline-none pb-4 transition-colors text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows="12"
            placeholder="Start writing..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-lg text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20">
            Update Note
          </button>
          <button type="button" onClick={() => navigate("/")} className="px-8 bg-slate-800 text-slate-300 rounded-2xl font-semibold hover:bg-slate-700 transition-colors">
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;