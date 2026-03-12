import prisma from "../lib/prisma.js";

// ─────────────────────────────────────────
// GET /api/admin/stats — Estadísticas generales
// ─────────────────────────────────────────
export const obtenerStats = async (req, res) => {
  try {
    const [
      totalAutos,
      autosDisponibles,
      totalUsuarios,
      totalReservas,
      reservasPendientes,
      reservasConfirmadas,
      reservasCanceladas,
      reservasCompletadas,
      ingresosTotales,
      ingresosMes,
    ] = await Promise.all([
      prisma.auto.count(),
      prisma.auto.count({ where: { disponible: true } }),
      prisma.usuario.count(),
      prisma.reserva.count(),
      prisma.reserva.count({ where: { estado: "PENDIENTE" } }),
      prisma.reserva.count({ where: { estado: "CONFIRMADA" } }),
      prisma.reserva.count({ where: { estado: "CANCELADA" } }),
      prisma.reserva.count({ where: { estado: "COMPLETADA" } }),
      prisma.pago.aggregate({
        where: { estado: "PAGADO" },
        _sum: { monto: true },
      }),
      prisma.pago.aggregate({
        where: {
          estado: "PAGADO",
          fecha: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { monto: true },
      }),
    ]);

    // Últimas 5 reservas
    const ultimasReservas = await prisma.reserva.findMany({
      take: 5,
      orderBy: { creadoEn: "desc" },
      include: {
        auto: { select: { marca: true, modelo: true } },
        usuario: { select: { nombre: true, email: true } },
        pago: { select: { estado: true } },
      },
    });

    return res.status(200).json({
      autos: {
        total: totalAutos,
        disponibles: autosDisponibles,
        ocupados: totalAutos - autosDisponibles,
      },
      usuarios: { total: totalUsuarios },
      reservas: {
        total: totalReservas,
        pendientes: reservasPendientes,
        confirmadas: reservasConfirmadas,
        canceladas: reservasCanceladas,
        completadas: reservasCompletadas,
      },
      ingresos: {
        total: Number(ingresosTotales._sum.monto ?? 0),
        mes: Number(ingresosMes._sum.monto ?? 0),
      },
      ultimasReservas,
    });
  } catch (error) {
    console.error("Error al obtener stats:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
