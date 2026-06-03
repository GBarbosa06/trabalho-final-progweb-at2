import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
