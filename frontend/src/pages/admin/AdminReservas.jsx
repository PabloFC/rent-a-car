import { useState, useEffect, useRef } from "react";
import { adminService } from "../../services/api";
import ReservasFilter from "./components/reservas/ReservasFilter";
import ReservasTable from "./components/reservas/ReservasTable";

// ── Constantes ────────────────────────────────────────────────────────────────

const ESTADOS_RESERVA = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [cambiando, setCambiando] = useState(null);
  const requestIdRef = useRef(0);

  const cargar = async (estado = "") => {
    const requestId = ++requestIdRef.current;
    setCargando(true);

    try {
      const data = await adminService.listarReservas(estado || undefined);
      if (requestId !== requestIdRef.current) return;

      setReservas(data.reservas);
      setError("");
    } catch {
      if (requestId !== requestIdRef.current) return;
      setError("No se pudieron cargar las reservas.");
    } finally {
      if (requestId !== requestIdRef.current) return;
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
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo cambiar el estado.");
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

        <ReservasFilter
          estados={ESTADOS_RESERVA}
          filtro={filtro}
          onCambiarFiltro={setFiltro}
        />
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
        <ReservasTable
          reservas={reservas}
          estadosReserva={ESTADOS_RESERVA}
          cambiando={cambiando}
          onCambiarEstado={handleCambiarEstado}
        />
      )}
    </div>
  );
}

export default AdminReservas;
