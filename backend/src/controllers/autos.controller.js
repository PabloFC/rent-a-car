import prisma from "../lib/prisma.js";
import fs from "fs";

// ─────────────────────────────────────────
// GET /api/autos — Listar todos
// ─────────────────────────────────────────
export const listarAutos = async (req, res) => {
  try {
    const { disponible } = req.query;

    const filtro = {};
    if (disponible !== undefined) {
      filtro.disponible = disponible === "true";
    }

    const autos = await prisma.auto.findMany({
      where: filtro,
      orderBy: { creadoEn: "desc" },
    });

    return res.status(200).json({ autos });
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
    });

    if (!auto) {
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    return res.status(200).json({ auto });
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
