import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import { Link } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
        <p className="text-slate-400 mb-8 text-lg">Welcome back to your workspace.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-lg"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-base">
          New here? <Link to="/register" className="text-indigo-400 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login