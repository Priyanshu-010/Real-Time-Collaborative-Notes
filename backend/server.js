import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { initSocket } from "./src/config/socket.js";
import connectDb from "./src/config/db.js";
import authRouter from "./src/routes/auth.route.js"

const app = express()
const server = http.createServer(app);

initSocket(server)
dotenv.config()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter)


server.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
  connectDb()
})

export default app