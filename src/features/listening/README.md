# Feature: `listening` — Escucha activa y shadowing

Input comprensible auditivo más **shadowing**: reproducir un fragmento corto,
repetirlo en voz alta imitando ritmo y entonación, y compararse con el original.

## Estructura interna

| Carpeta       | Responsabilidad                                                                        |
| ------------- | -------------------------------------------------------------------------------------- |
| `lib/`        | Troceado del audio en fragmentos, sincronización transcripción ↔ tiempo, velocidad.    |
| `server/`     | Catálogo de audios/transcripciones y registro de sesiones de shadowing.                |
| `hooks/`      | Control del reproductor, bucle de fragmento, grabación con `MediaRecorder`.            |
| `components/` | Reproductor con bucle A-B, transcripción sincronizada, grabar/comparar.                |
| `types.ts`    | Tipos del dominio (`AudioClip`, `Segment`, `ShadowingTake`). Créalo cuando haga falta. |

## Reglas

- Toda la captura de micrófono es **client-side** y detrás de `"use client"`;
  pedir permiso solo cuando el usuario pulsa grabar.
- Fragmentos cortos (5–15 s) y repetibles: el shadowing depende de la
  repetición inmediata, no de la duración.
