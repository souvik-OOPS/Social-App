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
        const user = await User.findById(decodetoken.userId).select("name email")
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = decodetoken.userId;
        req.userName = user.name
        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
