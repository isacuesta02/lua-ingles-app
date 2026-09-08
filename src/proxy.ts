import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/session";

/**
 * En Next.js 16 el convenio `middleware.ts` está **deprecado y renombrado a
 * `proxy.ts`**; la función exportada debe llamarse `proxy`.
 *
 * Aquí solo se refresca la sesión de Supabase. La protección de rutas conviene
 * hacerla en los layouts del servidor, no aquí: el proxy corre antes del render
 * y puede desplegarse en el CDN, así que no es el sitio para lógica de
 * autorización.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
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
