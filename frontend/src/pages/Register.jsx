import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { register } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    register(name, email, password);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Register</h2>
        <p className="text-slate-400 mb-8 text-lg">Join your team and start collaborating.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-indigo-600/20 text-lg"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-base">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register