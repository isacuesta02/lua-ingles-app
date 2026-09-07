# Feature: `reading` — Input comprensible (lectura)

Entrega textos ligeramente por encima del nivel actual (**i+1**) y permite
convertir lo que no se entiende en material de estudio: seleccionar una palabra
o expresión y enviarla al feature `srs`.

## Estructura interna

| Carpeta       | Responsabilidad                                                                        |
| ------------- | -------------------------------------------------------------------------------------- |
| `lib/`        | Estimación de dificultad del texto, tokenización, emparejar nivel del usuario ↔ texto. |
| `server/`     | Carga de textos y persistencia de lo marcado durante la lectura.                       |
| `hooks/`      | Selección de texto, panel de glosa, progreso dentro del texto.                         |
| `components/` | Lector mobile-first, glosa emergente, acción "guardar en repasos".                     |
| `types.ts`    | Tipos del dominio (`Text`, `Difficulty`, `Lookup`). Créalo cuando haga falta.          |

## Reglas

- La lectura es la unidad principal, no un ejercicio: la UI no debe interrumpir
  el flujo de lectura con evaluaciones.
- Guardar un término aquí **crea un ítem en `srs`**, siempre a través de la API
  pública de ese feature.
