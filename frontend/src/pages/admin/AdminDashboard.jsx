import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/api";

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}
        >
          {sub}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ── Badge estado ──────────────────────────────────────────────────────────────

const ESTADO_BADGE = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800",
  COMPLETADA: "bg-blue-100 text-blue-800",
};

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Componente ────────────────────────────────────────────────────────────────

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await adminService.obtenerStats();
        setStats(data);
      } catch {
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">
        Dashboard
      </h1>
      <p className="text-gray-500 text-sm mb-8">Resumen general del sistema.</p>

      {/* ── Tarjetas de stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="🚗"
          label="Vehículos totales"
          value={stats.autos.total}
          sub={`${stats.autos.disponibles} disponibles`}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon="👥"
          label="Usuarios registrados"
          value={stats.usuarios.total}
          sub="Total"
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          icon="📅"
          label="Reservas totales"
          value={stats.reservas.total}
          sub={`${stats.reservas.pendientes} pendientes`}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          icon="💰"
          label="Ingresos este mes"
          value={`$${stats.ingresos.mes.toFixed(2)}`}
          sub={`$${stats.ingresos.total.toFixed(2)} total`}
          color="bg-green-100 text-green-700"
        />
      </div>

      {/* ── Estado de reservas ── */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Estado de reservas
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Pendientes",
                val: stats.reservas.pendientes,
                color: "bg-yellow-400",
              },
              {
                label: "Confirmadas",
                val: stats.reservas.confirmadas,
                color: "bg-green-400",
              },
              {
                label: "Canceladas",
                val: stats.reservas.canceladas,
                color: "bg-red-400",
              },
              {
                label: "Completadas",
                val: stats.reservas.completadas,
                color: "bg-blue-400",
              },
            ].map(({ label, val, color }) => {
              const pct = stats.reservas.total
                ? Math.round((val / stats.reservas.total) * 100)
                : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">
                      {val}{" "}
                      <span className="text-gray-400 font-normal">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Disponibilidad de flota
          </h2>
          <div className="flex items-center justify-center h-32">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray={`${stats.autos.total ? (stats.autos.disponibles / stats.autos.total) * 100 : 0} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {stats.autos.total
                    ? Math.round(
                        (stats.autos.disponibles / stats.autos.total) * 100,
                      )
                    : 0}
                  %
                </span>
                <span className="text-xs text-gray-400">libres</span>
              </div>
            </div>
          </div>
          <div className="flex justify-around text-center mt-2 text-sm">
            <div>
              <p className="font-bold text-amber-500">
                {stats.autos.disponibles}
              </p>
              <p className="text-gray-400 text-xs">Disponibles</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">{stats.autos.ocupados}</p>
              <p className="text-gray-400 text-xs">Ocupados</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Últimas reservas ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Últimas reservas</h2>
          <Link
            to="/admin/reservas"
            className="text-xs text-amber-600 hover:underline font-medium"
          >
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  #
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Usuario
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Vehículo
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Fecha
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Pago
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.ultimasReservas.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-400">#{r.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">
                      {r.usuario.nombre}
                    </p>
                    <p className="text-xs text-gray-400">{r.usuario.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {r.auto.marca} {r.auto.modelo}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {formatFecha(r.creadoEn)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_BADGE[r.estado]}`}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {r.pago ? (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          r.pago.estado === "PAGADO"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {r.pago.estado}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Sin pago</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
