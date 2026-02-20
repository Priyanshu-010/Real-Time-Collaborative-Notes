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
        console.log("Error in fetchNote EditNote: ", error)
        toast.error("Failed to load note");
        navigate("/");
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return toast.error("All fields are required");
    }

    try {
      await updateNote(id, { title, content });
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error in handleSubmit EditNote: ", error)
      toast.error("Access Denied");
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Note
        </h2>

        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Content</label>
          <textarea
            rows="6"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-semibold"
        >
          Update Note
        </button>
      </form>
    </div>
  );
};

export default EditNote;