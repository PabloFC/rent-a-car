// Formatear fecha a formato legible (DD/MM/YYYY)
export const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES");
};

// Formatear precio con símbolo de moneda
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(precio);
};

// Calcular días entre dos fechas
export const calcularDias = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin - inicio;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

// Validar formato de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
