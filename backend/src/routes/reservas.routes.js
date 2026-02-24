import { Router } from "express";
import {
  crearReserva,
  misReservas,
  obtenerReserva,
  cancelarReserva,
  listarReservas,
  cambiarEstado,
} from "../controllers/reservas.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas de usuario autenticado
router.post("/", verificarToken, crearReserva);
router.get("/mis-reservas", verificarToken, misReservas);
router.get("/:id", verificarToken, obtenerReserva);
router.patch("/:id/cancelar", verificarToken, cancelarReserva);

// Rutas de admin
router.get("/", verificarToken, esAdmin, listarReservas);
router.patch("/:id/estado", verificarToken, esAdmin, cambiarEstado);

export default router;
