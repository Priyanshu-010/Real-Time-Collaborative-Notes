import { Link, useNavigate } from "react-router-dom";

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${note._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(note._id);
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 transition"
    >
      <h3 className="text-lg font-semibold">{note.title}</h3>
      <p className="text-sm text-gray-400 mt-2">
        {note.content.slice(0, 60)}...
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleEdit}
          className="bg-blue-600 px-3 py-1 rounded text-sm cursor-pointer"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 px-3 py-1 rounded text-sm cursor-pointer"
        >
          Delete
        </button>
      </div>
    </Link>
  );
}

export default NoteCard;