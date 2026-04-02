import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../features/post/postSlice";
import "./CommentSection.css";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CommentSection({ postId, comments }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const commentText = text.trim();
    const tempId = `temp-${Date.now()}`;
    setText("");
    const result = await dispatch(
      addComment({
        postId,
        text: commentText,
        tempId,
        userName: user?.name || "you",
      }),
    );
    if (addComment.rejected.match(result)) {
      setText(commentText);
    }
  };

  return (
    <div className="comment-section">
      {comments.length > 0 && (
        <div className="comment-list">
          {comments.map((c) => (
            <div key={c._id} className="comment">
              <span className="comment-author">@{c.userName}</span>
              <span className="comment-time">{timeAgo(c.createdAt)}</span>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}
        </div>
      )}
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit" disabled={!text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
