import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm">N</div>
          <span>Notes<span className="text-indigo-500">App</span></span>
        </Link>

        {user ? (
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-sm font-semibold text-white">{user?.name}</span>
               <span className="text-[11px] text-slate-500 uppercase tracking-widest">Workspace</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/create" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20"
              >
                New Note
              </Link>
              <button 
                onClick={logout} 
                className="text-slate-400 hover:text-white font-medium text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-slate-950 hover:bg-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;