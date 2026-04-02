import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import genToken from "../utils/token.js";

export const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }
        if (name.length < 3 || name.length > 50) {
            return res.status(400).json({ message: "Name must be between 3 and 50 characters long" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        const { password: _, ...safeUser } = user.toObject()
        return res.status(201).json({ message: "User created successfully", user: safeUser })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        const { password: _, ...safeUser } = user.toObject()
        return res.status(200).json({ message: "User signed in successfully", user: safeUser })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
        })
        return res.status(200).json({ success: true, message: "User signed out successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}