import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [search, setSearch] = useState("");

  // Apply dark mode to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate("/login");
  };

  return (
    <div className="navbar-wrapper">
      {/* Top bar */}
      <div className="navbar-top">
        <span className="navbar-title">Social</span>
        <div className="navbar-top-right">
          <div className="navbar-user-menu">
            <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="nav-dropdown">
              <p className="nav-dropdown-name">{user?.name}</p>
              <p className="nav-dropdown-email">{user?.email}</p>
              <button className="nav-signout-btn" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="navbar-search-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search promotions, users, posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
        <button
          className="dark-toggle"
          onClick={() => setDarkMode((p) => !p)}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}
