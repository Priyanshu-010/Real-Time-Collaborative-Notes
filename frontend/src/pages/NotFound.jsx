import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-40">
      <h1 className="text-9xl font-black text-slate-800">404</h1>
      <p className="text-3xl font-bold text-white mt-4">Lost in space?</p>
      <p className="text-slate-500 mt-4 text-lg">The page you're looking for doesn't exist.</p>
      <Link to="/" className="inline-block mt-10 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-600/20">Return Home</Link>
    </div>
  );
}

export default NotFound;