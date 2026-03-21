import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/Icon";

const NAV_ITEMS = [
  {
    to: "/admin",
    label: "Dashboard",
    iconPath: "M3 3h18v18H3V3zm4 12h2V9H7v6zm4 0h2V6h-2v9zm4 0h2v-4h-2v4z",
    end: true,
  },
  {
    to: "/admin/autos",
    label: "Vehículos",
    iconPath:
      "M3 13l1-4a2 2 0 012-1.5h12a2 2 0 012 1.5l1 4M5 13h14M7 17a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zM6 17h12",
  },
  {
    to: "/admin/reservas",
    label: "Reservas",
    iconPath:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
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
          {NAV_ITEMS.map(({ to, label, iconPath, end }) => (
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
              <Icon path={iconPath} className="w-5 h-5" />
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
            <Icon
              path="M10 19l-7-7m0 0l7-7m-7 7h18"
              className="w-4 h-4"
            />
            Volver al sitio
          </NavLink>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors text-left"
          >
            <Icon
              path="M17 16l4-4m0 0l-4-4m4 4H9m4 8H5a2 2 0 01-2-2V6a2 2 0 012-2h8"
              className="w-4 h-4"
            />
            Cerrar sesión
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
