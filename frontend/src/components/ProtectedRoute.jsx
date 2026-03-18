import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to={requiredRole === "doctor" ? "/doctor/login" : "/login"} replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return children;
}

