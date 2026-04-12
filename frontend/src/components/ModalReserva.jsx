import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reservasService } from "../services/api";
import { hoy, calcularDias, inicioDelDia } from "../utils/dateHelpers";
import { formatTarjeta, formatExpiry } from "../utils/paymentHelpers";

function ModalReserva({ vehiculo, onCerrar }) {
  const { estaAutenticado, usuario } = useAuth();
  const navigate = useNavigate();

  const [paso, setPaso] = useState("fechas"); // fechas | pago
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [tarjeta, setTarjeta] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [errorReserva, setErrorReserva] = useState("");

  const dias = calcularDias(fechaInicio, fechaFin);
  const total = dias * vehiculo.precio;

  const handlePagar = async (e) => {
    e.preventDefault();
    setErrorReserva("");

    const hoyLocal = hoy();
    if (fechaInicio < hoyLocal || fechaFin < hoyLocal) {
      setErrorReserva("No se permiten fechas anteriores a hoy.");
      return;
    }

    if (fechaInicio >= fechaFin) {
      setErrorReserva(
        "La fecha de devolución debe ser posterior a la recogida.",
      );
      return;
    }

    setProcesando(true);

    try {
      const data = await reservasService.crear({
        autoId: Number(vehiculo.id),
        fechaInicio,
        fechaFin,
      });

      navigate(`/reservas/${data.reserva.id}/pagar`);
      onCerrar();
    } catch (err) {
      setErrorReserva(
        err.response?.data?.error || "No se pudo crear la reserva.",
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">
              Reservar vehículo
            </h2>
            <p className="text-sm text-gray-500">
              {vehiculo.marca} {vehiculo.modelo} · {vehiculo.precio}€/día
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* ── No autenticado ── */}
        {!estaAutenticado && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-gray-800 font-semibold mb-1">
              Necesitas iniciar sesión
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Inicia sesión o crea una cuenta para reservar este vehículo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCerrar}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-2.5 rounded-lg text-sm font-bold transition"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        )}

        {/* ── Paso: fechas ── */}
        {estaAutenticado && paso === "fechas" && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Recogida
                </label>
                <input
                  type="date"
                  min={hoy()}
                  value={fechaInicio}
                  onChange={(e) => {
                    setFechaInicio(e.target.value);
                    setFechaFin("");
                    setErrorReserva("");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Devolución
                </label>
                <input
                  type="date"
                  min={fechaInicio || hoy()}
                  value={fechaFin}
                  onChange={(e) => {
                    setFechaFin(e.target.value);
                    setErrorReserva("");
                  }}
                  disabled={!fechaInicio}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-40"
                />
              </div>
            </div>

            {dias > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {dias} día{dias > 1 ? "s" : ""} × {vehiculo.precio}€
                </span>
                <span className="font-bold text-gray-900">{total}€ total</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={onCerrar}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                disabled={dias <= 0}
                onClick={() => setPaso("pago")}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 disabled:cursor-not-allowed text-black py-2.5 rounded-lg text-sm font-bold transition"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── Paso: pago ── */}
        {estaAutenticado && paso === "pago" && (
          <form onSubmit={handlePagar} className="p-5 space-y-4">
            {/* Resumen */}
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>
                  {vehiculo.marca} {vehiculo.modelo}
                </span>
                <span>{dias} días</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Total a pagar</span>
                <span className="text-amber-600">{total}€</span>
              </div>
            </div>

            {errorReserva && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {errorReserva}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Nombre en la tarjeta
              </label>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                placeholder="NOMBRE APELLIDO"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent tracking-wide"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Número de tarjeta
              </label>
              <input
                required
                value={tarjeta}
                onChange={(e) => setTarjeta(formatTarjeta(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono tracking-widest focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Caducidad
                </label>
                <input
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  CVV
                </label>
                <input
                  required
                  type="password"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="•••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPaso("fechas")}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                ← Atrás
              </button>
              <button
                type="submit"
                disabled={procesando}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-black py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
              >
                {procesando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creando reserva...
                  </>
                ) : (
                  "Continuar al pago"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalReserva;
