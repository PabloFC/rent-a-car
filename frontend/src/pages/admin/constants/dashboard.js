export const DASHBOARD_STAT_CARDS = [
  {
    key: "autos",
    icon: "M3 13l1-4a2 2 0 012-1.5h12a2 2 0 012 1.5l1 4M5 13h14M7 17a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zM6 17h12",
    label: "Vehículos totales",
    color: "bg-blue-100 text-blue-700",
    getValue: (stats) => stats.autos.total,
    getSub: (stats) => `${stats.autos.disponibles} disponibles`,
  },
  {
    key: "usuarios",
    icon: "M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87m8-4.13a4 4 0 11-8 0 4 4 0 018 0zM9 11a4 4 0 100-8 4 4 0 000 8z",
    label: "Usuarios registrados",
    color: "bg-purple-100 text-purple-700",
    getValue: (stats) => stats.usuarios.total,
    getSub: () => "Total",
  },
  {
    key: "reservas",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    label: "Reservas totales",
    color: "bg-yellow-100 text-yellow-700",
    getValue: (stats) => stats.reservas.total,
    getSub: (stats) => `${stats.reservas.pendientes} pendientes`,
  },
  {
    key: "ingresos",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V5m0 11v3M4 7h16M4 17h16M3 5h18v14H3V5z",
    label: "Ingresos este mes",
    color: "bg-green-100 text-green-700",
    getValue: (stats) => `${stats.ingresos.mes.toFixed(2)}€`,
    getSub: (stats) => `${stats.ingresos.total.toFixed(2)}€ total`,
  },
];

export const DASHBOARD_STATUS_ITEMS = [
  { key: "pendientes", label: "Pendientes", color: "bg-yellow-400" },
  { key: "confirmadas", label: "Confirmadas", color: "bg-green-400" },
  { key: "canceladas", label: "Canceladas", color: "bg-red-400" },
  { key: "completadas", label: "Completadas", color: "bg-blue-400" },
];

export const DASHBOARD_RESERVA_ESTADO_BADGE = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800",
  COMPLETADA: "bg-blue-100 text-blue-800",
};

export const formatDashboardDate = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
