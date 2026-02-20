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
      console.log("Error in fetchNotes Dashborad: ", error);
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
        console.log("Error in HandleDelete DashBoard: ", error);
        toast.error("Delete failed");
      }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
