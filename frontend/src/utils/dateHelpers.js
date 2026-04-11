// ────────────────────────────────────────────────────────────────────
// Date helper functions for reservations and date handling
// ────────────────────────────────────────────────────────────────────

/**
 * Retorna la fecha de hoy en formato ISO local (YYYY-MM-DD)
 * No depende de UTC, usa la zona horaria local del navegador
 */
export const getTodayLocalISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Alias para getTodayLocalISO() para compatibilidad
 */
export const hoy = () => getTodayLocalISO();

/**
 * Calcula los días entre dos fechas
 * @param {string} fechaInicio - Fecha en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha en formato YYYY-MM-DD
 * @returns {number} Número de días (0 si no hay fechas válidas)
 */
export const calcularDias = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return 0;
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const ms = fin - inicio;
  return Math.max(0, Math.ceil(ms / 86400000));
};

/**
 * Obtiene el inicio de un día (00:00:00) en zona local
 * Útil para comparar solo fechas sin importar la hora
 * @param {string} fechaString - Fecha en formato YYYY-MM-DD
 * @returns {Date|null} Objeto Date al inicio del día, o null si es inválida
 */
export const inicioDelDia = (fecha) => {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Valida que una fecha no sea anterior a hoy
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean} true si la fecha es válida (hoy o posterior)
 */
export const esValidaFechaFutura = (fecha) => {
  const fechaObj = inicioDelDia(fecha);
  const hoyObj = inicioDelDia(getTodayLocalISO());
  return fechaObj && hoyObj && fechaObj >= hoyObj;
};
