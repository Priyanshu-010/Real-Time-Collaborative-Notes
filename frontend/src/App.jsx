import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateNote from "./pages/CreateNote"
import EditNote from "./pages/EditNote"
import NotePage from "./pages/NotePage"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen selection:bg-indigo-500/30">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>

          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateNote />
            </ProtectedRoute>
          }/>
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditNote />
            </ProtectedRoute>
          }/>
          <Route path="/note/:id" element={
            <ProtectedRoute>
              <NotePage  />
            </ProtectedRoute>
          }/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App