import prisma from "../lib/prisma.js";

// ─────────────────────────────────────────
// Utilidad: calcular días entre dos fechas
// ─────────────────────────────────────────
const calcularDias = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const ms = fin - inicio;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

// ─────────────────────────────────────────
// POST /api/reservas — Crear reserva (Usuario)
// ─────────────────────────────────────────
export const crearReserva = async (req, res) => {
  const { autoId, fechaInicio, fechaFin } = req.body;
  const usuarioId = req.usuario.id;

  if (!autoId || !fechaInicio || !fechaFin) {
    return res.status(400).json({ error: "autoId, fechaInicio y fechaFin son obligatorios" });
  }

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (inicio >= fin) {
    return res.status(400).json({ error: "La fecha de fin debe ser posterior a la de inicio" });
  }

  if (inicio < new Date()) {
    return res.status(400).json({ error: "La fecha de inicio no puede ser en el pasado" });
  }

  try {
    // Verificar que el auto existe y está disponible
    const auto = await prisma.auto.findUnique({
      where: { id: Number(autoId) },
    });

    if (!auto) {
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    if (!auto.disponible) {
      return res.status(409).json({ error: "El auto no está disponible" });
    }

    // Verificar que no haya reservas solapadas (PENDIENTE o CONFIRMADA)
    const solapada = await prisma.reserva.findFirst({
      where: {
        autoId: Number(autoId),
        estado: { in: ["PENDIENTE", "CONFIRMADA"] },
        AND: [
          { fechaInicio: { lt: fin } },
          { fechaFin: { gt: inicio } },
        ],
      },
    });

    if (solapada) {
      return res.status(409).json({ error: "El auto ya tiene una reserva en esas fechas" });
    }

    // Calcular monto total
    const dias = calcularDias(fechaInicio, fechaFin);
    const montoTotal = Number(auto.precioPorDia) * dias;

    // Crear reserva y marcar auto como no disponible
    const [reserva] = await prisma.$transaction([
      prisma.reserva.create({
        data: {
          usuarioId,
          autoId: Number(autoId),
          fechaInicio: inicio,
          fechaFin: fin,
          montoTotal,
        },
        include: { auto: true },
      }),
      prisma.auto.update({
        where: { id: Number(autoId) },
        data: { disponible: false },
      }),
    ]);

    return res.status(201).json({
      mensaje: "Reserva creada correctamente",
      reserva,
      dias,
      montoTotal,
    });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// GET /api/reservas/mis-reservas — Ver mis reservas (Usuario)
// ─────────────────────────────────────────
export const misReservas = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId },
      include: { auto: true, pago: true },
      orderBy: { creadoEn: "desc" },
    });

    return res.status(200).json({ reservas });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// GET /api/reservas/:id — Ver una reserva (Usuario/Admin)
// ─────────────────────────────────────────
export const obtenerReserva = async (req, res) => {
  const { id } = req.params;
  const { id: usuarioId, rol } = req.usuario;

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
      include: { auto: true, usuario: { select: { id: true, nombre: true, email: true } }, pago: true },
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Un usuario solo puede ver sus propias reservas
    if (rol !== "ADMIN" && reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ error: "No tienes permiso para ver esta reserva" });
    }

    return res.status(200).json({ reserva });
  } catch (error) {
    console.error("Error al obtener reserva:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// PATCH /api/reservas/:id/cancelar — Cancelar (Usuario)
// ─────────────────────────────────────────
export const cancelarReserva = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ error: "No tienes permiso para cancelar esta reserva" });
    }

    if (reserva.estado === "CANCELADA") {
      return res.status(409).json({ error: "La reserva ya está cancelada" });
    }

    if (reserva.estado === "COMPLETADA") {
      return res.status(409).json({ error: "No se puede cancelar una reserva completada" });
    }

    // Cancelar reserva y liberar el auto
    const [reservaCancelada] = await prisma.$transaction([
      prisma.reserva.update({
        where: { id: Number(id) },
        data: { estado: "CANCELADA" },
      }),
      prisma.auto.update({
        where: { id: reserva.autoId },
        data: { disponible: true },
      }),
    ]);

    return res.status(200).json({ mensaje: "Reserva cancelada correctamente", reserva: reservaCancelada });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// GET /api/reservas — Listar todas (Admin)
// ─────────────────────────────────────────
export const listarReservas = async (req, res) => {
  try {
    const { estado } = req.query;

    const reservas = await prisma.reserva.findMany({
      where: estado ? { estado } : {},
      include: {
        auto: true,
        usuario: { select: { id: true, nombre: true, email: true } },
        pago: true,
      },
      orderBy: { creadoEn: "desc" },
    });

    return res.status(200).json({ reservas });
  } catch (error) {
    console.error("Error al listar reservas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// PATCH /api/reservas/:id/estado — Cambiar estado (Admin)
// ─────────────────────────────────────────
export const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${estadosValidos.join(", ")}` });
  }

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Si se cancela o completa, liberar el auto
    const liberarAuto = estado === "CANCELADA" || estado === "COMPLETADA";

    const operaciones = [
      prisma.reserva.update({
        where: { id: Number(id) },
        data: { estado },
      }),
    ];

    if (liberarAuto) {
      operaciones.push(
        prisma.auto.update({
          where: { id: reserva.autoId },
          data: { disponible: true },
        })
      );
    }

    const [reservaActualizada] = await prisma.$transaction(operaciones);

    return res.status(200).json({ mensaje: "Estado actualizado correctamente", reserva: reservaActualizada });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
