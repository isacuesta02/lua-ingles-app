/**
 * Rutas que no requieren sesión.
 *
 * El modelo es **denegar por defecto**: lo que no esté aquí queda protegido.
 * Es la única forma fiable de hacerlo desde el proxy, porque los route groups
 * (`(protected)`, `(auth)`) no aparecen en la URL — el proxy ve `/dashboard`,
 * nunca `/app/(protected)/dashboard`. Y así una ruta nueva nace protegida en
 * lugar de olvidada.
 */
const PUBLIC_PATHS = ["/login", "/signup"] as const;

/** Rutas públicas que no tiene sentido ver ya con la sesión iniciada. */
const AUTH_PATHS = ["/login", "/signup"] as const;

/** Adónde va alguien que acaba de iniciar sesión o ya la tenía. */
export const AFTER_LOGIN_PATH = "/dashboard";

/** Adónde se manda a quien no tiene sesión. */
export const LOGIN_PATH = "/login";

function matches(pathname: string, paths: readonly string[]): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isPublicPath(pathname: string): boolean {
  return matches(pathname, PUBLIC_PATHS);
}

export function isAuthPath(pathname: string): boolean {
  return matches(pathname, AUTH_PATHS);
}
