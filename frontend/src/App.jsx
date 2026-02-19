import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <div className="bg-black text-white min-h-screen">
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
    </div>
  )
}

export default App
