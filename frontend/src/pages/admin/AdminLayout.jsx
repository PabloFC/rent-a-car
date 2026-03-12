import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/autos", label: "Vehículos", icon: "🚗" },
  { to: "/admin/reservas", label: "Reservas", icon: "📅" },
];

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
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-700">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-0.5">
            Panel
          </p>
          <p className="text-lg font-bold font-serif">Administración</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500 text-black"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700 space-y-2">
          {/* Info del usuario */}
          <div className="px-2 py-2 rounded bg-gray-800">
            <p className="text-xs text-gray-400 truncate">{usuario?.nombre}</p>
            <p className="text-xs text-amber-400 font-semibold">Administrador</p>
          </div>

          <NavLink
            to="/"
            className="flex items-center gap-2 px-2 py-2 text-xs text-gray-400 hover:text-amber-400 transition-colors rounded hover:bg-gray-800"
          >
            ← Volver al sitio
          </NavLink>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors text-left"
          >
            ⏏ Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
