import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodetoken.userId).select("name")
        req.userId = decodetoken.userId;
        req.userName = user.name
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}