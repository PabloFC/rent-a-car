// ────────────────────────────────────────────────────────────────────
// Payment and formatting helper functions
// ────────────────────────────────────────────────────────────────────

/**
 * Formatea un string de tarjeta de crédito a bloques de 4 dígitos
 * Ej: "1234567890123456" → "1234 5678 9012 3456"
 * @param {string} value - Valor del input
 * @returns {string} Tarjeta formateada
 */
export const formatTarjeta = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

/**
 * Formatea un string de expiración a MM/AA
 * Ej: "1224" → "12/24"
 * @param {string} value - Valor del input
 * @returns {string} Expiración formateada
 */
export const formatExpiry = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/^(\d{2})(\d)/, "$1/$2");

/**
 * Valida que un CVV sea válido (3-4 dígitos)
 * @param {string} cvv - Valor del CVV
 * @returns {boolean} true si es válido
 */
export const validarCVV = (cvv) => {
  const cleanCVV = cvv.replace(/\D/g, "");
  return cleanCVV.length >= 3 && cleanCVV.length <= 4;
};

/**
 * Valida un número de tarjeta usando algoritmo Luhn
 * @param {string} numeroTarjeta - Número de tarjeta sin espacios
 * @returns {boolean} true si es válida
 */
export const validarTarjeta = (numeroTarjeta) => {
  const digits = numeroTarjeta.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 16) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};
