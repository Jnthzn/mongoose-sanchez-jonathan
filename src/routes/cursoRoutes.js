import { Router } from "express";
import {
  crearCurso,
  obtenerCursos,
  actualizarCurso,
  eliminarCurso,
  inscribirEstudiante,
} from "../controllers/cursoController.js";
import {
  cursoValidator,
  vincularEstudianteCursoValidator,
  validateMongoId,
} from "../middlewares/validators.js";
import { validateFields } from "../middlewares/validateFields.js";

const router = Router();

router.post("/", cursoValidator, validateFields, crearCurso);
router.get("/", obtenerCursos);
router.put(
  "/:id",
  validateMongoId,
  cursoValidator,
  validateFields,
  actualizarCurso,
);
router.delete("/:id", validateMongoId, validateFields, eliminarCurso);

// Endpoint relación N:M
router.post(
  "/:cursoId/inscribir",
  vincularEstudianteCursoValidator,
  validateFields,
  inscribirEstudiante,
);

export default router;
