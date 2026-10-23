import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },

    // Relación 1:N con Perfil (docente del curso)
    docente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfil",
      required: true,
    },

    // Relación N:M con Estudiante
    estudiantes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Estudiante",
      },
    ],

    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Curso", cursoSchema);
