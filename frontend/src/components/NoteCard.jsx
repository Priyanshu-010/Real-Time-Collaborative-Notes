import { Link, useNavigate } from "react-router-dom";

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${note._id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(note._id);
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 group flex flex-col h-full shadow-lg"
    >
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-4 line-clamp-1">
          {note.title}
        </h3>
        <p className="text-slate-400 text-base leading-relaxed line-clamp-3">
          {note.content}
        </p>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={handleEdit}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors border border-slate-700"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-xl font-semibold text-sm transition-all border border-red-500/20"
        >
          Delete
        </button>
      </div>
    </Link>
  );
}

export default NoteCard;