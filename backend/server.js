import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { initSocket } from "./src/config/socket.js";
import connectDb from "./src/config/db.js";
import authRouter from "./src/routes/auth.route.js"
import noteRouter from "./src/routes/note.route.js"
import versionRouter from "./src/routes/version.routes.js"

dotenv.config()
const app = express()
const server = http.createServer(app);

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/notes", noteRouter)
app.use("/api/versions", versionRouter)

initSocket(server)

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
  connectDb()
})

export default app