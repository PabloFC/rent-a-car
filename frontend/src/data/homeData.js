export const STATS = [
  { num: "500+", label: "Vehículos disponibles" },
  { num: "10.000+", label: "Clientes satisfechos" },
  { num: "15", label: "Años de experiencia" },
  { num: "4.9★", label: "Valoración media" },
];

export const VENTAJAS = [
  {
    num: "01",
    title: "Sin Depósito",
    desc: "Sin franquicia ni depósitos. Seguro total incluido en cada reserva.",
    // shield-check: protección y seguridad total
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    num: "02",
    title: "Mejor Precio Garantizado",
    desc: "Precios transparentes sin cargos ocultos. Si encuentras algo más barato, te lo igualamos.",
    // tag: etiqueta de precio
    path: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  {
    num: "03",
    title: "Cancelación Gratuita",
    desc: "Cancela sin coste hasta 24 horas antes de la recogida. Sin letra pequeña.",
    // calendar: cancelación con fecha libre
    path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    num: "04",
    title: "Atención 24/7",
    desc: "Equipo de asistencia disponible cualquier día del año, a cualquier hora.",
    // phone: asistencia telefónica los 365 días
    path: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z",
  },
];

export const FLOTA = [
  {
    cls: "bg-economico",
    badge: "Desde 25€/día",
    title: "Económicos",
    desc: "Perfectos para ciudad y trayectos cortos.",
    slug: "economicos",
  },
  {
    cls: "bg-suv",
    badge: "Desde 45€/día",
    title: "SUV",
    desc: "Comodidad y espacio para toda la familia.",
    slug: "suv",
  },
  {
    cls: "bg-premium",
    badge: "Desde 80€/día",
    title: "Premium",
    desc: "Lujo y prestaciones superiores.",
    slug: "premium",
  },
];

export const CAMPOS_FECHA = [
  { label: "Recogida", key: "recogida" },
  { label: "Devolución", key: "devolucion" },
];
