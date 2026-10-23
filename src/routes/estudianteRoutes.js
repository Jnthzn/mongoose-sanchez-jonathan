import { Router } from "express";
import {
  crearEstudiante,
  obtenerEstudiantes,
  actualizarEstudiante,
  eliminarEstudiante,
} from "../controllers/estudianteController.js";
import {
  estudianteValidator,
  validateMongoId,
} from "../middlewares/validators.js";
import { validateFields } from "../middlewares/validateFields.js";

const router = Router();

router.post("/", estudianteValidator, validateFields, crearEstudiante);
router.get("/", obtenerEstudiantes);
router.put(
  "/:id",
  validateMongoId,
  estudianteValidator,
  validateFields,
  actualizarEstudiante,
);
router.delete("/:id", validateMongoId, validateFields, eliminarEstudiante);

export default router;
