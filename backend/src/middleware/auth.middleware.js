import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protect = async (req, res, next) =>{
  const authHeader = req.headers.authorization

  if(!authHeader || !authHeader.startsWith("Bearer")){
    req.user = null;
    return res.status(400).json({message: "Unauthorized"})
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = await User.findById(decoded.userId)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    next();
  } catch (error) {
    console.log(error, "error in auth middleware");
    res.status(401).json({ message: "Unauthorized" });
  }
}