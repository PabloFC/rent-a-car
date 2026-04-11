import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Icon from "../components/Icon";
import { STATS, VENTAJAS, FLOTA, CAMPOS_FECHA } from "../data/homeData";
import { getTodayLocalISO } from "../utils/dateHelpers";

function Home() {
  const navigate = useNavigate();
  const [fechas, setFechas] = useState({ recogida: "", devolucion: "" });
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const hoy = getTodayLocalISO();

  const handleBuscar = (e) => {
    e.preventDefault();

    if (!fechas.recogida || !fechas.devolucion) {
      setErrorBusqueda("Debes indicar fecha de recogida y devolución.");
      return;
    }

    if (fechas.recogida < hoy || fechas.devolucion < hoy) {
      setErrorBusqueda("No se pueden seleccionar fechas anteriores a hoy.");
      return;
    }

    const inicio = new Date(fechas.recogida);
    const fin = new Date(fechas.devolucion);
    if (inicio >= fin) {
      setErrorBusqueda("La devolución debe ser posterior a la recogida.");
      return;
    }

    setErrorBusqueda("");
    const params = new URLSearchParams({
      recogida: fechas.recogida,
      devolucion: fechas.devolucion,
    });
    navigate(`/autos?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative text-white bg-cover bg-hero min-h-[88vh] flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        <div className="relative container mx-auto px-4 pt-24 pb-12 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Más de 500 vehículos disponibles hoy
          </div>

          <div className="max-w-xl">
            <h1 className="text-6xl font-bold mb-5 leading-tight font-serif">
              <span className="text-amber-400">Alquiler</span>
              <br />
              <span className="text-white">Premium</span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              La mejor selección de vehículos para tu viaje. Precios
              competitivos, servicio profesional y sin sorpresas.
            </p>
          </div>

          <form
            onSubmit={handleBuscar}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-2xl border border-white/20"
          >
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">
              Busca tu vehículo
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {CAMPOS_FECHA.map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-600 uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    type="date"
                    min={key === "devolucion" ? fechas.recogida || hoy : hoy}
                    value={fechas[key]}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFechas((f) => {
                        if (key !== "recogida") {
                          return { ...f, [key]: value };
                        }

                        // Si cambia recogida, limpiamos devolución si queda inválida.
                        const devolucionInvalida =
                          f.devolucion && value && f.devolucion <= value;

                        return {
                          ...f,
                          recogida: value,
                          devolucion: devolucionInvalida ? "" : f.devolucion,
                        };
                      });
                      setErrorBusqueda("");
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition text-sm"
                  />
                </div>
              ))}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black py-3 px-5 rounded-xl font-bold transition-all text-center text-sm shadow-lg shadow-amber-500/30"
                >
                  Buscar Vehículos
                </button>
              </div>
            </div>
            {errorBusqueda && (
              <p
                role="alert"
                aria-live="polite"
                className="mt-3 text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 font-medium"
              >
                {errorBusqueda}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* ── Strip de confianza ── */}
      <div className="bg-black border-b border-amber-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-amber-400 font-serif">
                  {num}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Ventajas ── */}
      <div className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <SectionHeader
            tag="Nuestros beneficios"
            title="¿Por qué elegirnos?"
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {VENTAJAS.map(({ num, title, desc, path }) => (
              <div
                key={num}
                className="group flex items-start gap-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300"
              >
                <span className="text-5xl font-black text-amber-500/20 group-hover:text-amber-500/40 font-serif leading-none select-none transition-colors shrink-0">
                  {num}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-amber-500/10 p-2 rounded-lg">
                      <Icon path={path} className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="font-bold text-white text-base">{title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Flota ── */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeader
            tag="Nuestra flota"
            title="Elige tu vehículo"
            subtitle="Disponemos de una amplia gama de vehículos para adaptarnos a tus necesidades"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {FLOTA.map(({ cls, badge, title, desc, slug }) => (
              <div
                key={title}
                className="group bg-gray-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-amber-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-52 bg-cover relative ${cls}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {badge}
                  </span>
                  <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl font-serif">
                    {title}
                  </h3>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">{desc}</p>
                  <Link
                    to={`/flota/${slug}`}
                    className="shrink-0 ml-4 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Ver vehículos →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Final ── */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Empieza hoy
          </p>
          <h2 className="text-4xl font-bold mb-4 font-serif">
            ¿Listo para tu próximo viaje?
          </h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            Regístrate gratis y reserva tu vehículo en menos de 2 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-black px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              Crear cuenta gratuita
            </Link>
            <Link
              to="/autos"
              className="border border-white/20 hover:border-amber-400 hover:text-amber-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
            >
              Ver vehículos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
