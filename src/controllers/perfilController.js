import { matchedData } from "express-validator";
import Perfil from "../models/Perfil.js";

export const crearPerfil = async (req, res) => {
  try {
    const data = matchedData(req);
    const nuevoPerfil = await Perfil.create(data);
    res.status(201).json({ ok: true, data: nuevoPerfil });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const obtenerPerfiles = async (req, res) => {
  try {
    const perfiles = await Perfil.find({ activo: true });
    res.status(200).json({ ok: true, data: perfiles });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req);
    const perfilActualizado = await Perfil.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!perfilActualizado) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Perfil no encontrado" });
    }
    res.status(200).json({ ok: true, data: perfilActualizado });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

export const eliminarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    // Eliminación lógica
    const perfilEliminado = await Perfil.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    if (!perfilEliminado) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Perfil no encontrado" });
    }
    res.status(200).json({
      ok: true,
      mensaje: "Perfil desactivado correctamente (eliminación lógica)",
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};
