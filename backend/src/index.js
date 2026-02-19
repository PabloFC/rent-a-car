import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.json({
    mensaje: "🚗 API de Rent a Car funcionando",
    version: "1.0.0",
    status: "ok",
  });
});

// Rutas de la API (se añadirán pronto)
// app.use('/api/auth', authRoutes);
// app.use('/api/autos', autosRoutes);
// app.use('/api/reservas', reservasRoutes);

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

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
