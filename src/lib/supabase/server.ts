import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

import { supabaseEnv } from "./env";

/**
 * Cliente de Supabase para **Server Components, Server Actions y Route
 * Handlers**.
 *
 * Hay que crear uno **por request**: nunca guardarlo en una variable de módulo
 * ni compartirlo entre peticiones, porque lleva dentro las cookies de sesión de
 * un usuario concreto.
 *
 * ```tsx
 * const supabase = await createClient();
 * const { data } = await supabase.from("learning_items").select();
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = supabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Un Server Component no puede escribir cookies y `set` lanza aquí.
          // Es seguro ignorarlo: quien refresca la sesión es `src/proxy.ts`,
          // que sí puede escribir en la respuesta.
          //
          // Si esto se dispara desde una Server Action o un Route Handler, es
          // un bug de verdad: ahí las cookies sí se pueden escribir.
        }
      },
    },
  });
}

/** Cliente tipado con el esquema real de la base de datos. */
export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
