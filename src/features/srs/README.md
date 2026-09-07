# Feature: `srs` — Repetición espaciada

Decide **cuándo** se vuelve a mostrar cada ítem (vocabulario, colocación, patrón
gramatical) y ejecuta la sesión de repaso como **práctica de recuperación
activa**: el usuario intenta recordar antes de ver la respuesta.

## Estructura interna

| Carpeta       | Responsabilidad                                                                         |
| ------------- | --------------------------------------------------------------------------------------- |
| `lib/`        | Algoritmo de scheduling puro (SM-2 / FSRS). Sin React, sin I/O, fácil de testear.       |
| `server/`     | Server Actions y acceso a datos (mazos, tarjetas, historial de repasos).                |
| `hooks/`      | Estado de cliente de la sesión de repaso (cola actual, tarjeta revelada, etc.).         |
| `components/` | UI de la tarjeta, botones de autoevaluación y resumen de sesión.                        |
| `types.ts`    | Tipos del dominio (`Card`, `ReviewGrade`, `SchedulingState`). Créalo cuando haga falta. |

## Reglas

- Sin puntos, rachas ni insignias: el único feedback es la propia programación
  de los repasos y lo que muestre `progress`.
- El algoritmo vive en `lib/` como funciones puras para poder cambiar de SM-2 a
  FSRS sin tocar la UI.
