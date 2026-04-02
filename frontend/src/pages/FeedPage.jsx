import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeed, createPost } from "../features/post/postSlice";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import "./FeedPage.css";

const FILTERS = ["All Post", "Most Liked", "Most Commented"];

export default function FeedPage() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);
  const [activeFilter, setActiveFilter] = useState("All Post");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handlePost = async () => {
    if (!text.trim() && !image) return;
    setPosting(true);
    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (image) formData.append("image", image);
    await dispatch(createPost(formData));
    setText("");
    setImage(null);
    setPosting(false);
  };

  const getFilteredPosts = () => {
    switch (activeFilter) {
      case "Most Liked":
        return [...posts].sort((a, b) => b.likes.length - a.likes.length);
      case "Most Commented":
        return [...posts].sort((a, b) => b.comments.length - a.comments.length);
      default:
        return posts;
    }
  };

  return (
    <div className="feed-page">
      <Navbar />

      {/* Create Post Box */}
      <div className="create-post-box">
        <div className="create-post-header">
          <span className="create-post-title">Create Post</span>
          <div className="create-post-tabs">
            <button className="cp-tab active">All Posts</button>
          </div>
        </div>
        <textarea
          className="create-post-input"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        {image && (
          <div className="cp-image-preview">
            <img src={URL.createObjectURL(image)} alt="preview" />
            <button onClick={() => setImage(null)}>✕</button>
          </div>
        )}
        <div className="create-post-actions">
          <div className="cp-icons">
            <button
              className="cp-icon-btn"
              onClick={() => fileRef.current?.click()}
            >
              📷
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <button
            className="post-submit-btn"
            onClick={handlePost}
            disabled={posting || (!text.trim() && !image)}
          >
            ➤ {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading && <p className="feed-status">Loading...</p>}
      {error && <p className="feed-error">Error: {error}</p>}
      <div className="feed-list">
        {getFilteredPosts().length === 0 && !loading && (
          <p className="feed-status">No posts found</p>
        )}
        {getFilteredPosts().map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
