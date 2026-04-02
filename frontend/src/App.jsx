import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { clearUser, fetchCurrentUser, setUser } from "./features/auth/authSlice";

const ProtectedRoute = ({ children }) => {
  const { user, checkingSession } = useSelector((state) => state.auth);
  if (checkingSession) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { user, checkingSession } = useSelector((state) => state.auth);
  if (checkingSession) return null;
  return !user ? children : <Navigate to="/" replace />;
};

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(setUser(user));
      } catch (error) {
        console.error("Failed to load user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }

    dispatch(fetchCurrentUser()).unwrap().catch(() => {
      dispatch(clearUser());
      localStorage.removeItem("user");
    });
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
