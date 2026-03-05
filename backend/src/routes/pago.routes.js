import { Router } from "express";
import { procesarPago, obtenerPago } from "../controllers/pago.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/pagos — Procesar pago (usuario autenticado)
router.post("/", verificarToken, procesarPago);

// GET /api/pagos/:reservaId — Ver pago de una reserva (usuario autenticado)
router.get("/:reservaId", verificarToken, obtenerPago);

export default router;
