import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import UploadOnCloudinary from "../utils/cloudinary.js";

export const CreatePost = async (req, res) => {
    try {
        const { text } = req.body
        const imageBuffer = req.file?.buffer

        if (!text && !imageBuffer) {
            return res.status(400).json({ message: "Post must have text or image" })
        }

        let imageUrl = ""
        if (imageBuffer) {
            const uploaded = await UploadOnCloudinary(imageBuffer, req.file.originalname)
            if (!uploaded) {
                return res.status(500).json({ message: "Image upload failed" })
            }
            imageUrl = uploaded.secure_url
        }

        const post = await Post.create({
            author: req.userId,
            text: text || "",
            image: imageUrl,
        })
        const populated = await post.populate("author", "name email")
        return res.status(201).json({ message: "Post created successfully", post: populated })
    } catch (error) {
        console.error("CreatePost error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const getFeed = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "name email")
        return res.status(200).json({ posts })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "name email")
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        const alreadyLiked = post.likes.includes(req.userId)
        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.userId)
            post.likedUserNames = post.likedUserNames.filter(name => name !== req.userName)
        } else {
            post.likes.push(req.userId)
            post.likedUserNames.push(req.userName)
        }
        await post.save()
        return res.status(200).json({
            postId: post._id,
            post: post,
            liked: !alreadyLiked,
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const addComment = async (req, res) => {
    try {
        const { text } = req.body
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" })
        }
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        post.comments.push({
            user: req.userId,
            userName: req.userName,
            text: text.trim()
        })
        await post.save()
        const newComment = post.comments[post.comments.length - 1]
        return res.status(200).json({ comment: newComment, message: "Comment added successfully", post })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}