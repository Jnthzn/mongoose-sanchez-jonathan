import { matchedData } from "express-validator";
import Estudiante from "../models/Estudiante.js";

export const crearEstudiante = async (req, res) => {
  try {
    const data = matchedData(req);
    const nuevoEstudiante = await Estudiante.create(data);
    res.status(201).json({ ok: true, data: nuevoEstudiante });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find({ activo: true })
      .populate("perfil", "biografia telefono")
      .populate("cursos", "titulo");
    res.status(200).json({ ok: true, data: estudiantes });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const actualizarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req);
    const estudianteActualizado = await Estudiante.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!estudianteActualizado) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Estudiante no encontrado" });
    }
    res.status(200).json({ ok: true, data: estudianteActualizado });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    // Eliminación lógica
    const estudianteEliminado = await Estudiante.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    if (!estudianteEliminado) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Estudiante no encontrado" });
    }
    res
      .status(200)
      .json({
        ok: true,
        mensaje: "Estudiante desactivado correctamente (eliminación lógica)",
      });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};
