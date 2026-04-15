const DATOS_FIJOS_VEHICULO = {
  plazas: 5,
  puertas: 4,
  transmision: "Automático",
  combustible: "Gasolina",
};

const categoriaPorPrecio = (precio) =>
  precio <= 40 ? "economicos" : precio <= 100 ? "suv" : "premium";

export const construirHeroClase = (tipo, esTodos) =>
  esTodos ? "bg-hero" : `bg-${tipo === "economicos" ? "economico" : tipo}`;

export const mapearVehiculosFlota = (
  autos,
  { esTodos, tipo, mostrarDisponibilidad },
) =>
  autos
    .filter(
      (auto) =>
        esTodos || categoriaPorPrecio(Number(auto.precioPorDia)) === tipo,
    )
    .map((auto) => ({
      ...DATOS_FIJOS_VEHICULO,
      id: auto.id,
      marca: auto.marca,
      modelo: auto.modelo,
      año: auto.anio,
      precio: Number(auto.precioPorDia),
      disponible: mostrarDisponibilidad ? true : auto.disponible,
      imagen: auto.imagen,
      descripcion: auto.descripcion,
    }));
