import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import ProtectedRoutes from "./ProtectedRoutes";
import useCheckAuth from "./hooks/api/useCheckAuth";
import Profile from "./pages/Profile/Profile";

export default function AppRoutes() {
  const { user } = useCheckAuth();
  return (
    <Routes>
      <Route
        path="/auth"
        element={user?.isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
      />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
