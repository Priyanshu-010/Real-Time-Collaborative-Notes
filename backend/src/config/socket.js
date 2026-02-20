import { Server } from "socket.io";
import registerNoteSocket from "../sockets/note.socket.js"
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.userId).select("-password");
      
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Attach the user object to the socket for use in events
      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket Auth Error:", err.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    registerNoteSocket(socket);

    socket.on("disconnect", ()=>{
      console.log("A user disconnected ", socket.id)
    })
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
