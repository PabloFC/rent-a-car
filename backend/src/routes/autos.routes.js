import { Router } from "express";
import {
  listarAutos,
  obtenerAuto,
  crearAuto,
  actualizarAuto,
  eliminarAuto,
  subirImagen,
} from "../controllers/autos.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Rutas públicas
router.get("/", listarAutos);
router.get("/:id", obtenerAuto);

// Rutas protegidas (solo Admin)
router.post("/", verificarToken, esAdmin, crearAuto);
router.put("/:id", verificarToken, esAdmin, actualizarAuto);
router.delete("/:id", verificarToken, esAdmin, eliminarAuto);
router.post(
  "/:id/imagen",
  verificarToken,
  esAdmin,
  upload.single("imagen"),
  subirImagen,
);

export default router;
