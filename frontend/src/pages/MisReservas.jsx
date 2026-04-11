import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reservasService } from "../services/api";
import { calcularDias } from "../utils/dateHelpers";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const calcularPrecioPorDia = (total, dias) => {
  return dias > 0 ? (total / dias).toFixed(2) : 0;
};

const ESTADO_BADGE = {
  PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMADA: "bg-green-100 text-green-800 border-green-200",
  CANCELADA: "bg-red-100 text-red-800 border-red-200",
  COMPLETADA: "bg-blue-100 text-blue-800 border-blue-200",
};

const PAGO_BADGE = {
  PENDIENTE: "bg-gray-100 text-gray-600",
  PAGADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-red-100 text-red-700",
  REEMBOLSADO: "bg-purple-100 text-purple-700",
};

// ── Componente ────────────────────────────────────────────────────────────────

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cancelando, setCancelando] = useState(null);

  const cargarReservas = async () => {
    try {
      const data = await reservasService.obtenerMisReservas();
      setReservas(data.reservas);
    } catch {
      setError("No se pudieron cargar tus reservas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    setCancelando(id);
    try {
      await reservasService.cancelar(id);
      await cargarReservas();
    } catch {
      alert("No se pudo cancelar la reserva.");
    } finally {
      setCancelando(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-2/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-44 h-36 sm:h-auto bg-gray-200 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1 p-5 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-serif mb-1">
            Mis Reservas
          </h1>
          <p className="text-gray-500">
            Gestiona y realiza el pago de tus reservas activas.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Sin reservas */}
        {reservas.length === 0 && !error && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No tienes reservas aún
            </h3>
            <p className="text-gray-500 mb-6">
              Explora nuestra flota y reserva tu vehículo ideal.
            </p>
            <Link
              to="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded transition-colors"
            >
              Ver vehículos
            </Link>
          </div>
        )}

        {/* Lista de reservas */}
        <div className="space-y-4">
          {reservas.map((reserva) => {
            const estadoPago = reserva.pago?.estado ?? "PENDIENTE";
            const diasReserva = calcularDias(
              reserva.fechaInicio,
              reserva.fechaFin,
            );
            const precioPorDia = calcularPrecioPorDia(
              reserva.montoTotal,
              diasReserva,
            );
            const puedesPagar =
              (reserva.estado === "PENDIENTE" ||
                reserva.estado === "CONFIRMADA") &&
              estadoPago !== "PAGADO";
            const puedeCancelar =
              reserva.estado === "PENDIENTE" || reserva.estado === "CONFIRMADA";

            return (
              <div
                key={reserva.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Información */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {reserva.auto?.marca} {reserva.auto?.modelo}{" "}
                          <span className="text-gray-400 font-normal text-sm">
                            ({reserva.auto?.anio})
                          </span>
                        </h3>
                        <p className="text-sm text-gray-500">
                          Reserva #{reserva.id}
                        </p>
                      </div>

                      {/* Badge estado reserva */}
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${ESTADO_BADGE[reserva.estado]}`}
                      >
                        {reserva.estado}
                      </span>
                    </div>

                    {/* Fechas y duración */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4 py-3 border-y border-gray-100">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5 font-semibold">
                          Recogida
                        </p>
                        <p className="font-medium text-gray-800">
                          {formatFecha(reserva.fechaInicio)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5 font-semibold">
                          Devolución
                        </p>
                        <p className="font-medium text-gray-800">
                          {formatFecha(reserva.fechaFin)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5 font-semibold">
                          Duración
                        </p>
                        <p className="font-medium text-gray-800">
                          {diasReserva} día{diasReserva !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5 font-semibold">
                          Precio/Día
                        </p>
                        <p className="font-medium text-gray-800">
                          {precioPorDia}€
                        </p>
                      </div>
                    </div>

                    {/* Resumen de pago + acciones */}
                    <div className="bg-gray-50 -mx-5 -mb-5 px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-gray-500 uppercase font-semibold">
                            Total a pagar:
                          </span>
                          <span className="text-2xl font-bold text-amber-600">
                            {Number(reserva.montoTotal).toFixed(2)}€
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${PAGO_BADGE[estadoPago]}`}
                        >
                          {estadoPago === "PAGADO"
                            ? "✓ Pagado"
                            : estadoPago === "RECHAZADO"
                              ? "✗ Pago rechazado"
                              : estadoPago === "REEMBOLSADO"
                                ? "↩ Reembolsado"
                                : "⏳ Pendiente pago"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {puedeCancelar && (
                          <button
                            onClick={() => handleCancelar(reserva.id)}
                            disabled={cancelando === reserva.id}
                            className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 hover:border-red-400 px-4 py-2 rounded transition-colors disabled:opacity-50 hover:bg-red-50"
                          >
                            {cancelando === reserva.id
                              ? "Cancelando..."
                              : "Cancelar"}
                          </button>
                        )}
                        {puedesPagar && (
                          <Link
                            to={`/reservas/${reserva.id}/pagar`}
                            className="text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded transition-colors shadow-sm hover:shadow-md"
                          >
                            Pagar ahora
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MisReservas;
