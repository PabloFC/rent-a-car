import { useParams, Link, Navigate } from "react-router-dom";
import TarjetaVehiculo from "../components/TarjetaVehiculo";
import Icon from "../components/Icon";
import { VEHICULOS, CATEGORIA_LABELS } from "../data/vehiculos";

const ICON_BACK = "M15 19l-7-7 7-7";

function Flota() {
  const { tipo } = useParams();
  const datos = VEHICULOS[tipo];

  if (!datos) return <Navigate to="/" replace />;

  const { heroCls, items } = datos;
  const { titulo, subtitulo } = CATEGORIA_LABELS[tipo];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero de categoría */}
      <div className={`relative h-64 bg-cover ${heroCls}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-gray-300 hover:text-amber-400 text-sm font-medium mb-4 transition-colors w-fit"
          >
            <Icon path={ICON_BACK} className="w-4 h-4" />
            Volver
          </Link>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 w-fit">
            Nuestra flota
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">
            {titulo}
          </h1>
          <p className="text-gray-300 mt-2 text-base">{subtitulo}</p>
        </div>
      </div>

      {/* Grid de vehículos */}
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-400 text-sm mb-8">
          Mostrando{" "}
          <span className="text-amber-400 font-semibold">
            {items.length} vehículos
          </span>
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((v) => (
            <TarjetaVehiculo key={v.id} vehiculo={v} heroCls={heroCls} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Flota;
