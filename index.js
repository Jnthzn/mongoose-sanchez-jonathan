import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

import perfilRoutes from "./src/routes/perfilRoutes.js";
import estudianteRoutes from "./src/routes/estudianteRoutes.js";
import cursoRoutes from "./src/routes/cursoRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Rutas de la API
app.use("/api/perfiles", perfilRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/cursos", cursoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
