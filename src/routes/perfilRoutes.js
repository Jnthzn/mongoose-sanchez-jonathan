import { Router } from "express";
import {
  crearPerfil,
  obtenerPerfiles,
  actualizarPerfil,
  eliminarPerfil,
} from "../controllers/perfilController.js";
import { perfilValidator, validateMongoId } from "../middlewares/validators.js";
import { validateFields } from "../middlewares/validateFields.js";

const router = Router();

router.post("/", perfilValidator, validateFields, crearPerfil);
router.get("/", obtenerPerfiles);
router.put(
  "/:id",
  validateMongoId,
  perfilValidator,
  validateFields,
  actualizarPerfil,
);
router.delete("/:id", validateMongoId, validateFields, eliminarPerfil);

export default router;
