// Utilidades de respuesta HTTP
export const respuestaExito = (
  res,
  data,
  mensaje = "Operación exitosa",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    mensaje,
    data,
  });
};

export const respuestaError = (
  res,
  mensaje = "Error en la operación",
  statusCode = 400,
) => {
  return res.status(statusCode).json({
    success: false,
    error: mensaje,
  });
};
