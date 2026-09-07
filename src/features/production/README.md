# Feature: `production` — Producción con feedback

El usuario **produce** lenguaje (escrito o hablado) sobre una consigna y recibe
feedback correctivo accionable: qué falló, por qué, y una reformulación nativa.

## Estructura interna

| Carpeta       | Responsabilidad                                                                      |
| ------------- | ------------------------------------------------------------------------------------ |
| `lib/`        | Construcción de prompts, parseo del feedback a una forma tipada, reglas de consigna. |
| `server/`     | Server Actions que llaman al proveedor de LLM y guardan intentos + correcciones.     |
| `hooks/`      | Estado del editor, envío, streaming de la respuesta.                                 |
| `components/` | Editor mobile-first, vista de diff/correcciones, consigna del día.                   |
| `types.ts`    | Tipos del dominio (`Prompt`, `Attempt`, `Correction`). Créalo cuando haga falta.     |

## Reglas

- **Ninguna clave de API sale al cliente**: las llamadas al modelo ocurren solo
  en `server/`.
- Cada error corregido debería poder convertirse en un ítem de `srs`; ahí está
  el ciclo producción → repaso.
- El feedback es descriptivo (qué y por qué), nunca una nota ni un puntaje.
