import { useState } from "react";
import Icon from "./Icon";
import ModalReserva from "./ModalReserva";
import { COMBUSTIBLE_BADGE } from "../data/vehiculos";

const SPECS_ICONS = {
  asiento:
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  puerta: "M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8l-4-4V8l4-4zm4 8v.01",
  transmision:
    "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  combustible: "M3 10h2l2 10h10l2-10h2M8 10V6a4 4 0 018 0v4",
};

function TarjetaVehiculo({ vehiculo, heroCls }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const {
    marca,
    modelo,
    año,
    precio,
    plazas,
    puertas,
    transmision,
    combustible,
    disponible,
  } = vehiculo;

  const specs = [
    { icon: SPECS_ICONS.asiento, label: `${plazas} plazas` },
    { icon: SPECS_ICONS.puerta, label: `${puertas} puertas` },
    { icon: SPECS_ICONS.transmision, label: transmision },
    { icon: SPECS_ICONS.combustible, label: combustible },
  ];

  return (
    <>
      {modalAbierto && (
        <ModalReserva
          vehiculo={vehiculo}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
      <div className="group bg-gray-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-amber-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className={`h-44 bg-cover relative ${heroCls}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {!disponible && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                No disponible
              </span>
            </div>
          )}
          <span
            className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${COMBUSTIBLE_BADGE[combustible] ?? "bg-white/10 text-gray-300 border-white/20"}`}
          >
            {combustible}
          </span>
          <div className="absolute bottom-3 left-4">
            <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">
              {marca}
            </p>
            <h3 className="text-white font-bold text-lg font-serif leading-tight">
              {modelo}
            </h3>
            <p className="text-gray-400 text-xs">{año}</p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4 flex-1">
          <div className="grid grid-cols-2 gap-2">
            {specs.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-gray-400 text-xs"
              >
                <span className="text-amber-400">
                  <Icon path={icon} className="w-4 h-4" />
                </span>
                {label}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
            <div>
              <span className="text-amber-400 text-xl font-bold font-serif">
                {precio}€
              </span>
              <span className="text-gray-500 text-xs ml-1">/día</span>
            </div>
            {disponible ? (
              <button
                onClick={() => setModalAbierto(true)}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all"
              >
                Reservar →
              </button>
            ) : (
              <span className="text-gray-500 text-xs font-semibold px-4 py-2 rounded-lg border border-gray-600 cursor-not-allowed">
                No disponible
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TarjetaVehiculo;
