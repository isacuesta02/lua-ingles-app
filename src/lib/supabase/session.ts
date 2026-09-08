import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/database.types";

import { supabaseEnv } from "./env";

export type SessionResult = {
  /** Respuesta con las cookies de sesión ya actualizadas. */
  response: NextResponse;
  /** `true` si la request llega con un token válido. */
  isAuthenticated: boolean;
};

/**
 * Refresca el token de sesión y lo reescribe en las cookies de la respuesta.
 *
 * Se llama desde `src/proxy.ts` en cada request. Sin esto, los Server
 * Components — que no pueden escribir cookies — se quedarían con un token
 * caducado y el usuario aparecería deslogueado de forma intermitente.
 */
export async function updateSession(
  request: NextRequest,
): Promise<SessionResult> {
  const { url, anonKey } = supabaseEnv();

  // Respuesta que se irá reconstruyendo si Supabase rota las cookies.
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // 1. En la request, para que el render que viene detrás ya vea el
        //    token nuevo.
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        // 2. Se recrea la respuesta a partir de la request actualizada...
        response = NextResponse.next({ request });

        // 3. ...y se escriben las cookies con sus opciones para el navegador.
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }

        // 4. Cabeceras `no-store` que manda la librería. Sin ellas, un CDN o
        //    proxy inverso podría cachear esta respuesta y servirle el token
        //    de una persona a otra.
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // No metas código entre `createServerClient` y esta llamada. Es lo que
  // dispara el refresco; si algo se ejecuta antes y falla, la sesión se pierde.
  // `getClaims()` verifica el JWT localmente cuando el proyecto usa claves
  // asimétricas, así que evita un viaje a la API de Auth en cada request.
  const { data } = await supabase.auth.getClaims();

  return { response, isAuthenticated: data?.claims != null };
}
