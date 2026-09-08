import { NextResponse, type NextRequest } from "next/server";

import {
  AFTER_LOGIN_PATH,
  LOGIN_PATH,
  isAuthPath,
  isPublicPath,
} from "@/lib/routes";
import { updateSession } from "@/lib/supabase/session";

/**
 * En Next.js 16 el convenio `middleware.ts` está **deprecado y renombrado a
 * `proxy.ts`**; la función exportada debe llamarse `proxy`.
 *
 * Hace dos cosas: refrescar la sesión de Supabase y redirigir según haya token
 * o no. Ojo: esto es comodidad de navegación, **no** el límite de seguridad. El
 * guard de verdad está en `(protected)/layout.tsx` y, debajo, en las políticas
 * RLS de Postgres.
 */
export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && !isPublicPath(pathname)) {
    return redirectTo(LOGIN_PATH, request, response);
  }

  if (isAuthenticated && isAuthPath(pathname)) {
    return redirectTo(AFTER_LOGIN_PATH, request, response);
  }

  return response;
}

/**
 * Redirige conservando las cookies que `updateSession` acaba de escribir.
 *
 * Sin este traspaso se pierde el token recién refrescado y la siguiente request
 * vuelve a refrescar — o directamente deja al usuario fuera.
 */
function redirectTo(
  pathname: string,
  request: NextRequest,
  from: NextResponse,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirectResponse = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }
  return redirectResponse;
}

export const config = {
  matcher: [
    /*
     * Todas las rutas salvo:
     * - _next/static  (bundles)
     * - _next/image   (optimización de imágenes)
     * - favicon.ico
     * - archivos estáticos por extensión
     *
     * Sin este filtro el proxy correría también sobre CSS, JS e imágenes, lo
     * que añade latencia a cada asset sin ninguna ganancia.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
