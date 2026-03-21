import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reservasService } from "../services/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Cargando reservas...</p>
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
                  {/* Imagen del auto */}
                  <div className="sm:w-44 h-36 sm:h-auto bg-gray-100 flex-shrink-0">
                    {reserva.auto?.imagen ? (
                      <img
                        src={`/uploads/autos/${reserva.auto.imagen}`}
                        alt={`${reserva.auto.marca} ${reserva.auto.modelo}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🚗
                      </div>
                    )}
                  </div>

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

                    {/* Fechas y monto */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                          Recogida
                        </p>
                        <p className="font-medium text-gray-800">
                          {formatFecha(reserva.fechaInicio)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                          Devolución
                        </p>
                        <p className="font-medium text-gray-800">
                          {formatFecha(reserva.fechaFin)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                          Total
                        </p>
                        <p className="font-bold text-amber-600 text-base">
                          {Number(reserva.montoTotal).toFixed(2)}€
                        </p>
                      </div>
                    </div>

                    {/* Badge pago + acciones */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${PAGO_BADGE[estadoPago]}`}
                      >
                        Pago: {estadoPago}
                      </span>

                      <div className="flex gap-2">
                        {puedeCancelar && (
                          <button
                            onClick={() => handleCancelar(reserva.id)}
                            disabled={cancelando === reserva.id}
                            className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 hover:border-red-400 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                          >
                            {cancelando === reserva.id
                              ? "Cancelando..."
                              : "Cancelar"}
                          </button>
                        )}
                        {puedesPagar && (
                          <Link
                            to={`/reservas/${reserva.id}/pagar`}
                            className="text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-1.5 rounded transition-colors"
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
