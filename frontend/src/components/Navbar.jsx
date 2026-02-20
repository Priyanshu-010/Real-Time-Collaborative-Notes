import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        NotesApp
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{user?.name}</span>
        <Link to="/create" className="bg-green-600 px-3 py-2 rounded">
          + Create Note
        </Link>
        <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
