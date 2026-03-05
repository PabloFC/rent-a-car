import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import autosRoutes from "./routes/autos.routes.js";
import reservasRoutes from "./routes/reservas.routes.js";
import pagosRoutes from "./routes/pago.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Rent a Car funcionando",
    version: "1.0.0",
    status: "ok",
  });
});

// Servir imágenes estáticas
app.use("/uploads", express.static("uploads"));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/autos", autosRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/pagos", pagosRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    mensaje: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado a la base de datos PostgreSQL");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
  }
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
