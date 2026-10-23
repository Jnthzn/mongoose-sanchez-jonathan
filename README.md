# Práctica de MongoDB y Mongoose

## Estructura del Proyecto y Colecciones

El proyecto cuenta con 3 colecciones con relaciones embebidas y referenciadas:

1. **`Estudiante`**: Contiene la propiedad embebida `direccion` `{ calle, ciudad }`.
2. **`Perfil`**: Relación **1:1** con `Estudiante`.
3. **`Curso`**: Relación **1:N** con `Perfil` (Docente) y relación **N:M** con `Estudiante`.

---

## Justificación de Embebido vs Referenciado

- **Propiedad Embebida (`direccion` en `Estudiante`):** Se utilizó embebido porque la dirección pertenece de forma directa y exclusiva a un estudiante. No requiere ser compartida ni consultada de manera independiente.
- **Relación 1:1 (`Estudiante` <-> `Perfil`):** Se utilizó referencia mediante `ObjectId` con la opción `unique: true` para mantener los datos de perfil/biografía desacoplados del documento del estudiante.
- **Relación 1:N (`Perfil` <-> `Curso`):** Se utilizó referencia para que un docente (`Perfil`) pueda estar asignado a múltiples cursos sin duplicar su información personal en cada curso.
- **Relación N:M (`Estudiante` <-> `Curso`):** Se implementó mediante arreglos de referencias (`ObjectId`) en ambos esquemas (`cursos` en Estudiante y `estudiantes` en Curso), permitiendo relaciones bidireccionales.

---

## Respuestas a la Investigación

### 1. Uso de `populate` desde colecciones que no tienen referencias

Para consultar datos relacionados desde un modelo que no guarda explícitamente el `ObjectId` del otro (por ejemplo, desde `Perfil` hacia los `Curso`s que dicta), Mongoose permite definir **Virtuals con Populate**:

```javascript
perfilSchema.virtual("cursosDictados", {
  ref: "Curso",
  localField: "_id",
  foreignField: "docente",
});
```

Luego se invoca indicando los campos virtuales: .populate('cursosDictados').

### 2. Eliminaciones Lógicas y en Cascada

Eliminación Lógica: Se implementa agregando un atributo activo: { type: Boolean, default: true }. Las bajas actualizan este valor a false mediante findByIdAndUpdate en lugar de remover físicamente el documento (findByIdAndDelete).

Eliminación en Cascada Lógica: Al desactivar un recurso padre (ejemplo: un Curso), se ejecuta una actualización sobre las entidades asociadas para mantener la consistencia de datos, como remover la referencia del curso desactivado en la lista de los estudiantes inscriptos mediante el operador $pull:

```javascript
await Estudiante.updateMany(
  { cursos: cursoId },
  { $pull: { cursos: cursoId } },
);
```

### 3. Endpoint para nuevos vínculos en relaciones Muchos a Muchos (N:M)

Se habilita un endpoint específico (ej. POST /api/cursos/:cursoId/inscribir) que recibe el ID del recurso a asociar en el body.
Para evitar duplicados y asegurar consistencia, se utiliza el operador $addToSet de MongoDB en ambas colecciones:

```javascript
await Curso.findByIdAndUpdate(cursoId, {
  $addToSet: { estudiantes: estudianteId },
});
await Estudiante.findByIdAndUpdate(estudianteId, {
  $addToSet: { cursos: cursoId },
});
```
