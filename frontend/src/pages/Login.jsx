import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {login} = useContext(AuthContext)

  const handleSubmit = async(e)=>{
    e.preventDefault();
    login(email,password);
  }
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg w-80"
      >
        <h2 className="text-2xl mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          onChange={(e)=> setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-800 rounded"
          onChange={(e)=> setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 p-2 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login