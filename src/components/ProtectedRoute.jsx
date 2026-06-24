import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import { getHomePathForRole, isAdminRole, isClienteRole } from "../utils/roles.js";

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
  const { user, role, loading } = useAuthContext();

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  if (user) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }

  return <Outlet />;
}

export function RoleRoute({ allowed }) {
  const { role, loading } = useAuthContext();

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  if (allowed === "admin" && !isAdminRole(role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  if (allowed === "cliente" && !isClienteRole(role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}

export function HomeRedirect() {
  const { role, loading } = useAuthContext();

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  return <Navigate to={getHomePathForRole(role)} replace />;
}
