import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
