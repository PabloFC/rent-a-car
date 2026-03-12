import { Router } from "express";
import { obtenerStats } from "../controllers/admin.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/admin/stats — Solo Admins
router.get("/stats", verificarToken, esAdmin, obtenerStats);

export default router;
