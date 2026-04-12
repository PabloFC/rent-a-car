import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { reservasService, pagosService } from "../services/api";
import { calcularDias } from "../utils/dateHelpers";
import { formatTarjeta } from "../utils/paymentHelpers";
import { normalizarImagenPath } from "../utils/helpers";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Componente ────────────────────────────────────────────────────────────────

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null); // { exito: bool, mensaje: string }
  const [errorCarga, setErrorCarga] = useState("");

  // Formulario de pago
  const [metodo, setMetodo] = useState("TARJETA");
  const [nombre, setNombre] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [simularFallo, setSimularFallo] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await reservasService.obtenerPorId(id);
        setReserva(data.reserva);
      } catch {
        setErrorCarga("No se pudo cargar la reserva.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setResultado(null);

    try {
      const data = await pagosService.procesar({
        reservaId: Number(id),
        metodo,
        simularFallo,
      });

      setResultado({ exito: true, mensaje: data.mensaje });
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "Ocurrió un error al procesar el pago.";
      setResultado({ exito: false, mensaje });
    } finally {
      setProcesando(false);
    }
  };

  // ── Cargando ────────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Cargando reserva...</p>
        </div>
      </div>
    );
  }

  if (errorCarga || !reserva) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {errorCarga || "Reserva no encontrada."}
          </p>
          <Link
            to="/mis-reservas"
            className="text-amber-600 hover:underline font-medium"
          >
            Volver a mis reservas
          </Link>
        </div>
      </div>
    );
  }

  const dias = calcularDias(reserva.fechaInicio, reserva.fechaFin);

  // ── Resultado final ─────────────────────────────────────────────────────────

  if (resultado?.exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif mb-2">
            ¡Pago exitoso!
          </h2>
          <p className="text-gray-500 mb-6">{resultado.mensaje}</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-left mb-6 border border-gray-100">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Vehículo</span>
              <span className="font-medium text-gray-800">
                {reserva.auto?.marca} {reserva.auto?.modelo}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Período</span>
              <span className="font-medium text-gray-800">
                {formatFecha(reserva.fechaInicio)} →{" "}
                {formatFecha(reserva.fechaFin)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total pagado</span>
              <span className="font-bold text-amber-600">
                {Number(reserva.montoTotal).toFixed(2)}€
              </span>
            </div>
          </div>
          <Link
            to="/mis-reservas"
            className="inline-block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded transition-colors"
          >
            Ver mis reservas
          </Link>
        </div>
      </div>
    );
  }

  // ── Formulario ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/mis-reservas" className="hover:text-amber-600">
            Mis reservas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Pago</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 font-serif mb-8">
          Finalizar pago
        </h1>

        <div className="grid md:grid-cols-5 gap-6">
          {/* ── Formulario de pago ── */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-5">
                Método de pago
              </h2>

              {/* Selector de método */}
              <div className="flex gap-3 mb-6">
                {["TARJETA", "TRANSFERENCIA", "EFECTIVO"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetodo(m)}
                    className={`flex-1 py-2 text-sm font-medium rounded border transition-colors ${
                      metodo === m
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white text-gray-600 border-gray-300 hover:border-amber-400"
                    }`}
                  >
                    {m === "TARJETA"
                      ? "💳 Tarjeta"
                      : m === "TRANSFERENCIA"
                        ? "🏦 Transferencia"
                        : "💵 Efectivo"}
                  </button>
                ))}
              </div>

              {/* Pago rechazado */}
              {resultado && !resultado.exito && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-5 text-sm">
                  {resultado.mensaje}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Datos de tarjeta (solo si método = TARJETA) */}
                {metodo === "TARJETA" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nombre en la tarjeta
                      </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        placeholder="JUAN PÉREZ"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        value={tarjeta}
                        onChange={(e) =>
                          setTarjeta(formatTarjeta(e.target.value))
                        }
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono tracking-widest"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Vencimiento
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => {
                            let v = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4);
                            if (v.length >= 3)
                              v = v.slice(0, 2) + "/" + v.slice(2);
                            setExpiry(v);
                          }}
                          required
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          required
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {metodo === "TRANSFERENCIA" && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded p-4 text-sm">
                    <p className="font-semibold mb-1">Datos bancarios</p>
                    <p>Banco: Banco Nacional</p>
                    <p>CBU: 0000000000000000000000</p>
                    <p>Alias: RENTACAR.DEMO</p>
                    <p className="mt-2 text-blue-600">
                      Al confirmar, tu reserva será procesada.
                    </p>
                  </div>
                )}

                {metodo === "EFECTIVO" && (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded p-4 text-sm">
                    <p className="font-semibold mb-1">Pago en sucursal</p>
                    <p>
                      Presenta tu número de reserva{" "}
                      <strong>#{reserva.id}</strong> en cualquiera de nuestras
                      sucursales para abonar en efectivo.
                    </p>
                  </div>
                )}

                {/* Toggle simular fallo */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <input
                    type="checkbox"
                    id="simularFallo"
                    checked={simularFallo}
                    onChange={(e) => setSimularFallo(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <label
                    htmlFor="simularFallo"
                    className="text-xs text-gray-500 select-none"
                  >
                    ⚡ Simular fallo de pago (modo demo)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={procesando}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded transition-colors text-sm"
                >
                  {procesando ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Procesando...
                    </span>
                  ) : (
                    `Pagar ${Number(reserva.montoTotal).toFixed(2)}€`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Resumen reserva ── */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Resumen</h2>

              {/* Imagen */}
              <div className="h-28 bg-gray-100 rounded-lg overflow-hidden mb-4">
                {reserva.auto?.imagen ? (
                  <img
                    src={normalizarImagenPath(reserva.auto.imagen)}
                    alt={`${reserva.auto.marca} ${reserva.auto.modelo}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🚗
                  </div>
                )}
              </div>

              <p className="font-bold text-gray-900 mb-1">
                {reserva.auto?.marca} {reserva.auto?.modelo}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Reserva #{reserva.id}
              </p>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Recogida</span>
                  <span className="font-medium text-gray-800">
                    {formatFecha(reserva.fechaInicio)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Devolución</span>
                  <span className="font-medium text-gray-800">
                    {formatFecha(reserva.fechaFin)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Días</span>
                  <span className="font-medium text-gray-800">{dias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Precio/día</span>
                  <span className="font-medium text-gray-800">
                    {Number(reserva.auto?.precioPorDia).toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-amber-600 text-lg">
                    {Number(reserva.montoTotal).toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
