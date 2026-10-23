import { matchedData } from "express-validator";
import Curso from "../models/Curso.js";
import Estudiante from "../models/Estudiante.js";

export const crearCurso = async (req, res) => {
  try {
    const data = matchedData(req);
    const nuevoCurso = await Curso.create(data);
    res.status(201).json({ ok: true, data: nuevoCurso });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const obtenerCursos = async (req, res) => {
  try {
    const cursos = await Curso.find({ activo: true })
      .populate("docente", "biografia telefono")
      .populate("estudiantes", "nombre email");
    res.status(200).json({ ok: true, data: cursos });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req);
    const cursoActualizado = await Curso.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!cursoActualizado) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Curso no encontrado" });
    }
    res.status(200).json({ ok: true, data: cursoActualizado });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoEliminado = await Curso.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    if (!cursoEliminado) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Curso no encontrado" });
    }

    // Eliminación en cascada lógica: remover el ID del curso de los estudiantes inscriptos
    await Estudiante.updateMany({ cursos: id }, { $pull: { cursos: id } });

    res
      .status(200)
      .json({
        ok: true,
        mensaje: "Curso desactivado y desvinculado de los estudiantes",
      });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// Endpoint específico N:M
export const inscribirEstudiante = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const { estudianteId } = matchedData(req);

    // Agregar estudiante al curso
    await Curso.findByIdAndUpdate(cursoId, {
      $addToSet: { estudiantes: estudianteId },
    });

    // Agregar curso al estudiante
    await Estudiante.findByIdAndUpdate(estudianteId, {
      $addToSet: { cursos: cursoId },
    });

    res
      .status(200)
      .json({
        ok: true,
        mensaje: "Estudiante inscripto en el curso correctamente",
      });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};
