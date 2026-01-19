import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/admin" />;
  return children;
}
