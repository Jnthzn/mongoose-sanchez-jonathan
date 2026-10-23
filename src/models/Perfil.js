import mongoose from "mongoose";

const perfilSchema = new mongoose.Schema(
  {
    biografia: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Perfil", perfilSchema);
