import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUp, clearError } from "../features/auth/authSlice";
import "./Auth.css";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    dispatch(clearError());
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signUp(form));
    if (signUp.fulfilled.match(result)) navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the community</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
