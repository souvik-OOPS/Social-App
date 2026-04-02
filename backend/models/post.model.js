import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true, minlength: 1, maxLength: 1000, trim: true }
}, { timestamps: true })

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "", maxLength: 5000, trim: true },
    image: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: 0 }],
    likedUserNames: [{ type: String, default: "" }],
    comments: [commentSchema]
}, { timestamps: true })

export default mongoose.model("Post", postSchema)