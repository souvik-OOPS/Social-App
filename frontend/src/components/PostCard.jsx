import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../features/post/postSlice";
import CommentSection from "./CommentSection";
import "./PostCard.css";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);

  const alreadyLiked = post.likes?.some(
    (id) => id === user?._id || id?._id === user?._id,
  );

  const handleLike = () => dispatch(likePost(post._id));

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-avatar-wrap">
          <div className="post-avatar">
            {post.author?.name?.[0]?.toUpperCase()}
          </div>
        </div>
        <div className="post-meta">
          <div className="post-author-row">
            <span className="post-author-name">{post.author?.name}</span>
            <span className="post-author-handle">
              @{post.author?.name?.toLowerCase().replace(/\s/g, "")}
            </span>
          </div>
          <span className="post-time">{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      {post.text && <p className="post-text">{post.text}</p>}
      {post.image && (
        <img
          src={
            typeof post.image === "string" && post.image.startsWith("http")
              ? post.image
              : `http://localhost:8000${post.image}`
          }
          alt="post"
          className="post-image"
        />
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${alreadyLiked ? "liked" : ""}`}
          onClick={() => handleLike()}
        >
          <span className="action-icon">{alreadyLiked ? "❤️" : "🤍"}</span>
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments((p) => !p)}
        >
          <span className="action-icon">💬</span>
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post._id} comments={post.comments || []} />
      )}
    </div>
  );
}
