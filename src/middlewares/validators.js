import { body, param } from "express-validator";
import Perfil from "../models/Perfil.js";
import Estudiante from "../models/Estudiante.js";
import Curso from "../models/Curso.js";

// Validar ID de MongoDB en parámetros
export const validateMongoId = [
  param("id")
    .isMongoId()
    .withMessage("El ID ingresado no es un MongoId válido"),
];

// Validaciones para Perfil
export const perfilValidator = [
  body("biografia")
    .notEmpty()
    .withMessage("La biografía es obligatoria")
    .isLength({ min: 5 })
    .withMessage("La biografía debe tener al menos 5 caracteres"),
  body("telefono").notEmpty().withMessage("El teléfono es obligatorio"),
];

// Validaciones para Estudiante (incluye validación embebida y referencia 1:1)
export const estudianteValidator = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Debe ser un email válido"),

  // Validaciones de la propiedad EMBEBIDA
  body("direccion.calle").notEmpty().withMessage("La calle es obligatoria"),
  body("direccion.ciudad").notEmpty().withMessage("La ciudad es obligatoria"),

  // Validación de la referencia (Perfil)
  body("perfil")
    .isMongoId()
    .withMessage("ID de perfil no válido")
    .custom(async (perfilId) => {
      const perfil = await Perfil.findById(perfilId);
      if (!perfil) throw new Error("El perfil especificado no existe");
    }),
];

// Validaciones para Curso (relación 1:N)
export const cursoValidator = [
  body("titulo").notEmpty().withMessage("El título es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  body("docente")
    .isMongoId()
    .withMessage("ID de docente no válido")
    .custom(async (docenteId) => {
      const docente = await Perfil.findById(docenteId);
      if (!docente) throw new Error("El docente especificado no existe");
    }),
];

// Validación para relación N:M (Inscribir Estudiante a Curso)
export const vincularEstudianteCursoValidator = [
  param("cursoId").isMongoId().withMessage("ID de curso no válido"),
  body("estudianteId")
    .isMongoId()
    .withMessage("ID de estudiante no válido")
    .custom(async (estudianteId, { req }) => {
      const estudiante = await Estudiante.findById(estudianteId);
      if (!estudiante) throw new Error("El estudiante no existe");

      const curso = await Curso.findById(req.params.cursoId);
      if (!curso) throw new Error("El curso no existe");

      if (curso.estudiantes.includes(estudianteId)) {
        throw new Error("El estudiante ya está inscripto en este curso");
      }
    }),
];
