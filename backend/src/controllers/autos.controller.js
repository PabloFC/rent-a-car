import prisma from "../lib/prisma.js";
import fs from "fs";

// ─────────────────────────────────────────
// GET /api/autos — Listar todos
// ─────────────────────────────────────────
export const listarAutos = async (req, res) => {
  try {
    const { disponible, fechaInicio, fechaFin } = req.query;

    const filtro = {};

    // Si llega un rango de fechas, devolvemos autos sin reservas solapadas.
    if (fechaInicio || fechaFin) {
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          error: "Para filtrar por fechas debes enviar fechaInicio y fechaFin",
        });
      }

      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
        return res.status(400).json({ error: "Formato de fecha inválido" });
      }

      if (inicio >= fin) {
        return res.status(400).json({
          error: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
      }

      filtro.reservas = {
        none: {
          estado: { in: ["PENDIENTE", "CONFIRMADA"] },
          AND: [{ fechaInicio: { lt: fin } }, { fechaFin: { gt: inicio } }],
        },
      };
    } else if (disponible !== undefined) {
      // Si no hay rango de fechas pero pide filtrar por disponibilidad, usa el campo
      filtro.disponible = disponible === "true";
    }

    // Obtener todos los autos con sus reservas activas
    const autos = await prisma.auto.findMany({
      where: filtro,
      include: {
        reservas: {
          where: {
            estado: { in: ["PENDIENTE", "CONFIRMADA"] },
            fechaFin: { gt: new Date() }, // Solo reservas que aún no han vencido
          },
        },
      },
      orderBy: { creadoEn: "desc" },
    });

    // Calcular disponibilidad real basada en reservas activas
    const autosConDisponibilidad = autos.map((auto) => ({
      ...auto,
      disponible: auto.reservas.length === 0, // Disponible si no tiene reservas activas
    }));

    return res.status(200).json({ autos: autosConDisponibilidad });
  } catch (error) {
    console.error("Error al listar autos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// GET /api/autos/:id — Obtener uno
// ─────────────────────────────────────────
export const obtenerAuto = async (req, res) => {
  const { id } = req.params;

  try {
    const auto = await prisma.auto.findUnique({
      where: { id: Number(id) },
      include: {
        reservas: {
          where: {
            estado: { in: ["PENDIENTE", "CONFIRMADA"] },
            fechaFin: { gt: new Date() }, // Solo reservas activas
          },
        },
      },
    });

    if (!auto) {
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    // Calcular disponibilidad real
    const autoConDisponibilidad = {
      ...auto,
      disponible: auto.reservas.length === 0,
    };

    return res.status(200).json({ auto: autoConDisponibilidad });
  } catch (error) {
    console.error("Error al obtener auto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// POST /api/autos — Crear (Admin)
// ─────────────────────────────────────────
export const crearAuto = async (req, res) => {
  const { marca, modelo, anio, precioPorDia, descripcion } = req.body;

  if (!marca || !modelo || !anio || !precioPorDia) {
    return res
      .status(400)
      .json({ error: "Marca, modelo, año y precio son obligatorios" });
  }

  try {
    const auto = await prisma.auto.create({
      data: {
        marca,
        modelo,
        anio: Number(anio),
        precioPorDia: Number(precioPorDia),
        descripcion: descripcion || null,
      },
    });

    return res.status(201).json({ mensaje: "Auto creado correctamente", auto });
  } catch (error) {
    console.error("Error al crear auto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// PUT /api/autos/:id — Actualizar (Admin)
// ─────────────────────────────────────────
export const actualizarAuto = async (req, res) => {
  const { id } = req.params;
  const { marca, modelo, anio, precioPorDia, descripcion, disponible } =
    req.body;

  try {
    const autoExistente = await prisma.auto.findUnique({
      where: { id: Number(id) },
    });

    if (!autoExistente) {
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    const auto = await prisma.auto.update({
      where: { id: Number(id) },
      data: {
        ...(marca && { marca }),
        ...(modelo && { modelo }),
        ...(anio && { anio: Number(anio) }),
        ...(precioPorDia && { precioPorDia: Number(precioPorDia) }),
        ...(descripcion !== undefined && { descripcion }),
        ...(disponible !== undefined && { disponible: Boolean(disponible) }),
      },
    });

    return res
      .status(200)
      .json({ mensaje: "Auto actualizado correctamente", auto });
  } catch (error) {
    console.error("Error al actualizar auto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// DELETE /api/autos/:id — Eliminar (Admin)
// ─────────────────────────────────────────
export const eliminarAuto = async (req, res) => {
  const { id } = req.params;

  try {
    const auto = await prisma.auto.findUnique({
      where: { id: Number(id) },
    });

    if (!auto) {
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    // Eliminar imagen si existe
    if (auto.imagen) {
      const rutaImagen = auto.imagen.replace("/uploads/", "uploads/");
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }

    await prisma.auto.delete({ where: { id: Number(id) } });

    return res.status(200).json({ mensaje: "Auto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar auto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ─────────────────────────────────────────
// POST /api/autos/:id/imagen — Subir imagen (Admin)
// ─────────────────────────────────────────
export const subirImagen = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No se proporcionó ninguna imagen" });
  }

  try {
    const auto = await prisma.auto.findUnique({
      where: { id: Number(id) },
    });

    if (!auto) {
      // Eliminar el archivo subido si el auto no existe
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    // Eliminar imagen anterior si existe
    if (auto.imagen) {
      const rutaAnterior = auto.imagen.replace("/uploads/", "uploads/");
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }
    }

    const urlImagen = `/uploads/${req.file.filename}`;

    const autoActualizado = await prisma.auto.update({
      where: { id: Number(id) },
      data: { imagen: urlImagen },
    });

    return res.status(200).json({
      mensaje: "Imagen subida correctamente",
      imagen: urlImagen,
      auto: autoActualizado,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
