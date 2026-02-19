import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { initSocket } from "./src/config/socket.js";
import connectDb from "./src/config/db.js";

const app = express()
const server = http.createServer(app);

initSocket(server)

app.use(cors())
app.use(express.json())
dotenv.config()

const PORT = process.env.PORT || 5000;

app.get("/", (req,res)=>{
  res.send("Hello World")
})

server.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
  connectDb()
})

export default app