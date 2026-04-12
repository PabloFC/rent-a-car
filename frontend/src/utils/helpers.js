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

// Re-exportar calcularDias desde dateHelpers para compatibilidad
export { calcularDias, getTodayLocalISO, hoy } from "./dateHelpers";

// Validar formato de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Normaliza rutas de imagen de autos para soportar formatos antiguos y nuevos.
export const normalizarImagenPath = (imagen) => {
  if (!imagen || typeof imagen !== "string") return "";

  const valor = imagen.trim().replace(/\\/g, "/");

  if (valor.startsWith("http://") || valor.startsWith("https://")) {
    return valor;
  }

  if (valor.startsWith("/uploads/autos/")) {
    return valor;
  }

  if (valor.startsWith("/uploads/")) {
    return `/uploads/autos/${valor.replace(/^\/uploads\/+/, "")}`;
  }

  if (valor.startsWith("uploads/autos/")) {
    return `/${valor}`;
  }

  if (valor.startsWith("uploads/")) {
    return `/uploads/autos/${valor.replace(/^uploads\/+/, "")}`;
  }

  return `/uploads/autos/${valor.replace(/^\/+/, "")}`;
};
