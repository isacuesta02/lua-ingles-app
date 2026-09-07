# Feature: `auth` — Sesión y usuario actual

App personal: un solo usuario. El objetivo no es un sistema de identidad
completo, sino **proteger los datos y dar un `userId` estable** al resto de los
features.

## Estructura interna

| Carpeta       | Responsabilidad                                                                   |
| ------------- | --------------------------------------------------------------------------------- |
| `lib/`        | Lectura y validación de la sesión, helpers de redirección.                        |
| `server/`     | Server Actions de login/logout y el `getCurrentUser()` que consume todo lo demás. |
| `hooks/`      | Acceso al usuario desde componentes de cliente.                                   |
| `components/` | Formulario de acceso y menú de cuenta.                                            |
| `types.ts`    | Tipos del dominio (`User`, `Session`). Créalo cuando haga falta.                  |

## Reglas

- La comprobación de sesión se hace **en el servidor** (layout o Server Action),
  nunca solo ocultando UI en el cliente.
- Los demás features nunca leen cookies ni tokens: piden el usuario a la API
  pública de `auth`.
