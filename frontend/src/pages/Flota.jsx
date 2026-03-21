import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import TarjetaVehiculo from "../components/TarjetaVehiculo";
import Icon from "../components/Icon";
import { CATEGORIA_LABELS } from "../data/vehiculos";
import { autosService } from "../services/api";

const ICON_BACK = "M15 19l-7-7 7-7";

function Flota() {
  const { tipo } = useParams();
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  if (!CATEGORIA_LABELS[tipo]) return <Navigate to="/" replace />;

  useEffect(() => {
    const cargarAutos = async () => {
      try {
        const data = await autosService.obtenerTodos();
        setAutos(data.autos || []);
        setError("");
      } catch {
        setError("No se pudieron cargar los vehículos.");
      } finally {
        setCargando(false);
      }
    };

    cargarAutos();
  }, []);

  const categoriaPorPrecio = (precioPorDia) => {
    const precio = Number(precioPorDia);
    if (precio <= 40) return "economicos";
    if (precio <= 100) return "suv";
    return "premium";
  };

  const vehiculos = autos
    .filter((auto) => categoriaPorPrecio(auto.precioPorDia) === tipo)
    .map((auto) => ({
      id: auto.id,
      marca: auto.marca,
      modelo: auto.modelo,
      año: auto.anio,
      precio: Number(auto.precioPorDia),
      plazas: 5,
      puertas: 4,
      transmision: "Automático",
      combustible: "Gasolina",
      disponible: auto.disponible,
      imagen: auto.imagen,
      descripcion: auto.descripcion,
    }));

  const heroCls = `bg-${tipo === "economicos" ? "economico" : tipo}`;
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
        {cargando ? (
          <div className="py-20 flex justify-center">
            <div className="w-9 h-9 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-8">
              Mostrando{" "}
              <span className="text-amber-400 font-semibold">
                {vehiculos.length} vehículos
              </span>
            </p>

            {vehiculos.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                <p className="text-gray-300 font-medium">
                  No hay vehículos en esta categoría.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Añade vehículos desde el panel admin para verlos aquí.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vehiculos.map((v) => (
                  <TarjetaVehiculo key={v.id} vehiculo={v} heroCls={heroCls} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Flota;
