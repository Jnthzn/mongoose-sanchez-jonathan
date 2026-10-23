import mongoose from "mongoose";

const estudianteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },

    // Propiedad embebida
    direccion: {
      calle: { type: String, required: true },
      ciudad: { type: String, required: true },
    },

    // Relación 1:1 con Perfil
    perfil: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfil",
      required: true,
      unique: true,
    },

    // Relación N:M con Curso
    cursos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
      },
    ],

    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Estudiante", estudianteSchema);
