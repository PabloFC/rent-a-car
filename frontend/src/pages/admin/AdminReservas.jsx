import { useState, useEffect } from "react";
import { adminService } from "../../services/api";

// ── Constantes ────────────────────────────────────────────────────────────────

const ESTADOS_RESERVA = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

const ESTADO_BADGE = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800",
  COMPLETADA: "bg-blue-100 text-blue-800",
};

const PAGO_BADGE = {
  PENDIENTE: "bg-gray-100 text-gray-500",
  PAGADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-red-100 text-red-600",
  REEMBOLSADO: "bg-purple-100 text-purple-700",
};

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Componente ────────────────────────────────────────────────────────────────

function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [cambiando, setCambiando] = useState(null);

  const cargar = async (estado = "") => {
    setCargando(true);
    try {
      const data = await adminService.listarReservas(estado || undefined);
      setReservas(data.reservas);
    } catch {
      setError("No se pudieron cargar las reservas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar(filtro);
  }, [filtro]);

  const handleCambiarEstado = async (reservaId, nuevoEstado) => {
    setCambiando(reservaId);
    try {
      await adminService.cambiarEstadoReserva(reservaId, nuevoEstado);
      await cargar(filtro);
    } catch (err) {
      alert(err.response?.data?.error || "No se pudo cambiar el estado.");
    } finally {
      setCambiando(null);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">
            Reservas
          </h1>
          <p className="text-gray-500 text-sm">
            {reservas.length} reserva{reservas.length !== 1 ? "s" : ""}{" "}
            encontrada{reservas.length !== 1 ? "s" : ""}.
          </p>
        </div>

        {/* Filtro por estado */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltro("")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filtro === ""
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
            }`}
          >
            Todas
          </button>
          {ESTADOS_RESERVA.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                filtro === e
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-amber-400"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                    Período
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Pago
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-gray-400"
                    >
                      No hay reservas con este filtro.
                    </td>
                  </tr>
                ) : (
                  reservas.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-gray-400 font-mono">
                        #{r.id}
                      </td>

                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {r.usuario.nombre}
                        </p>
                        <p className="text-xs text-gray-400">
                          {r.usuario.email}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">
                          {r.auto.marca} {r.auto.modelo}
                        </p>
                        <p className="text-xs text-gray-400">{r.auto.anio}</p>
                      </td>

                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                        <p>{formatFecha(r.fechaInicio)}</p>
                        <p className="text-xs text-gray-400">
                          → {formatFecha(r.fechaFin)}
                        </p>
                      </td>

                      <td className="px-5 py-3 font-bold text-amber-600">
                        ${Number(r.montoTotal).toFixed(2)}
                      </td>

                      <td className="px-5 py-3">
                        {r.pago ? (
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${PAGO_BADGE[r.pago.estado]}`}
                          >
                            {r.pago.estado}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Sin pago
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        {cambiando === r.id ? (
                          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <select
                            value={r.estado}
                            onChange={(e) =>
                              handleCambiarEstado(r.id, e.target.value)
                            }
                            className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-amber-500 ${ESTADO_BADGE[r.estado]}`}
                          >
                            {ESTADOS_RESERVA.map((e) => (
                              <option key={e} value={e}>
                                {e}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReservas;
