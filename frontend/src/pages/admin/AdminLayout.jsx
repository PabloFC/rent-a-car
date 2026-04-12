import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./components/layout/AdminSidebar";

function AdminLayout() {
  const { usuario, estaAutenticado, esAdmin, cargando, logout } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!estaAutenticado || !esAdmin()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar usuario={usuario} logout={logout} />

      {/* ── Contenido ── */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
