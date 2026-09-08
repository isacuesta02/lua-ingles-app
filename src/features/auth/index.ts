/**
 * API pública del feature `auth` (sesión y usuario actual).
 *
 * Todo lo que una ruta de `src/app` u otro feature necesite de aquí se exporta
 * en este archivo. Nadie debe importar rutas internas desde fuera del feature.
 *
 * Nota: este barrel mezcla componentes de cliente y módulos `server-only`, así
 * que solo debe importarse desde Server Components. Los formularios importan
 * sus acciones por ruta relativa, que es tráfico interno del feature.
 */
export { LoginForm } from "./components/login-form";
export { SignupForm } from "./components/signup-form";
export { SignOutButton } from "./components/sign-out-button";
export { getCurrentUser, requireUser } from "./server/current-user";
export type { AuthFormState } from "./types";
