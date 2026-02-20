import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../api/note.api";
import NoteCard from "../components/NoteCard";
import toast from "react-hot-toast";

function Dashboard() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await getNotes();
        setNotes(data);
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch notes");
      }
    };
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Note?"))
      try {
        await deleteNote(id);
        setNotes((prev) => prev.filter((note) => note._id !== id));
        toast.success("Note deleted");
      } catch (error) {
        console.log(error)
        toast.error("Delete failed");
      }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-lg">You have {notes.length} active notes.</p>
      </div>

      {notes.length === 0 ? (
        <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center">
          <p className="text-slate-500 text-xl font-medium">No notes found yet. Start by creating one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;