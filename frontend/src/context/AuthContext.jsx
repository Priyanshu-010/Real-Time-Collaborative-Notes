import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../api/auth.api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem("token", data.token);

      setUser(data.user);

      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.log("Error in login authContext: ", error);
      toast.error("Login Failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await registerUser({ name, email, password });
      localStorage.setItem("token", data.token);

      setUser(data.user);

      toast.success("Registration successful");
      navigate("/");
    } catch (error) {
      console.log("Error in register authContext: ", error);
      toast.error("Registration Failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
