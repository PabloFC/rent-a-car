import prisma from "../lib/prisma.js";

// ─────────────────────────────────────────
// POST /api/pagos — Procesar pago simulado
// ─────────────────────────────────────────
export const procesarPago = async (req, res) => {
  const { reservaId, metodo, simularFallo } = req.body;
  const usuarioId = req.usuario.id;

  if (!reservaId || !metodo) {
    return res.status(400).json({ error: "reservaId y metodo son obligatorios" });
  }

  const metodosValidos = ["TARJETA", "TRANSFERENCIA", "EFECTIVO"];
  if (!metodosValidos.includes(metodo)) {
    return res
      .status(400)
      .json({ error: `Método inválido. Valores permitidos: ${metodosValidos.join(", ")}` });
  }

  try {
    // Verificar que la reserva existe y pertenece al usuario
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(reservaId) },
      include: { pago: true },
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ error: "No tienes permiso para pagar esta reserva" });
    }

    if (reserva.estado === "CANCELADA") {
      return res.status(409).json({ error: "No se puede pagar una reserva cancelada" });
    }

    if (reserva.estado === "COMPLETADA") {
      return res.status(409).json({ error: "Esta reserva ya está completada" });
    }

    if (reserva.pago && reserva.pago.estado === "PAGADO") {
      return res.status(409).json({ error: "Esta reserva ya fue pagada" });
    }

    // ── Simulación del pago ──
    // Si simularFallo=true → pago rechazado (útil para demo)
    const pagoExitoso = !simularFallo;
    const estadoPago = pagoExitoso ? "PAGADO" : "RECHAZADO";
    const estadoReserva = pagoExitoso ? "CONFIRMADA" : reserva.estado;

    // Crear o actualizar el pago y, si fue exitoso, confirmar la reserva
    const operaciones = [];

    if (reserva.pago) {
      // Ya existe un pago (quizás fue rechazado antes) → actualizar
      operaciones.push(
        prisma.pago.update({
          where: { reservaId: Number(reservaId) },
          data: { estado: estadoPago, metodo, fecha: new Date() },
        })
      );
    } else {
      // Crear nuevo registro de pago
      operaciones.push(
        prisma.pago.create({
          data: {
            reservaId: Number(reservaId),
            monto: reserva.montoTotal,
            estado: estadoPago,
            metodo,
          },
        })
      );
    }

    // Actualizar estado de la reserva solo si el pago fue exitoso
    if (pagoExitoso) {
      operaciones.push(
        prisma.reserva.update({
          where: { id: Number(reservaId) },
          data: { estado: estadoReserva },
        })
      );
    }

    const [pago] = await prisma.$transaction(operaciones);

    if (!pagoExitoso) {
      return res.status(402).json({
        mensaje: "Pago rechazado. Verifica los datos de tu tarjeta e intenta de nuevo.",
        pago,
      });
    }

    return res.status(200).json({
      mensaje: "Pago procesado correctamente. ¡Reserva confirmada!",
      pago,
    });
  } catch (error) {
    console.error("Error al procesar pago:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// GET /api/pagos/:reservaId — Obtener pago de una reserva
// ─────────────────────────────────────────
export const obtenerPago = async (req, res) => {
  const { reservaId } = req.params;
  const { id: usuarioId, rol } = req.usuario;

  try {
    const pago = await prisma.pago.findUnique({
      where: { reservaId: Number(reservaId) },
      include: {
        reserva: {
          include: {
            auto: true,
            usuario: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
    });

    if (!pago) {
      return res.status(404).json({ error: "Pago no encontrado para esta reserva" });
    }

    // Un usuario solo puede ver sus propios pagos
    if (rol !== "ADMIN" && pago.reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ error: "No tienes permiso para ver este pago" });
    }

    return res.status(200).json({ pago });
  } catch (error) {
    console.error("Error al obtener pago:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
