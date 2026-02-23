import multer from "multer";
import path from "path";
import fs from "fs";

// Crear carpeta uploads si no existe
const uploadsDir = "uploads/autos";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `auto-${Date.now()}${ext}`;
    cb(null, nombre);
  },
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
});
