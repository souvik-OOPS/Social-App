import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../features/post/postSlice";
import "./CreatePostModal.css";
export default function CreatePostModal({ onClose }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      setError("Add some text or an image");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (image) formData.append("image", image);

    const result = await dispatch(createPost(formData));
    setLoading(false);
    if (createPost.fulfilled.match(result)) onClose();
    else setError(result.payload || "Failed to post");
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            maxLength={1000}
          />

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="preview" />
              <button className="remove-image" onClick={removeImage}>
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-image"
            onClick={() => fileRef.current?.click()}
          >
            <camera /> {image ? "Change image" : "Add image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading || (!text.trim() && !image)}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
