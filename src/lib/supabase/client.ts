import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

import { supabaseEnv } from "./env";

/**
 * Cliente de Supabase para **Client Components**.
 *
 * `createBrowserClient` es singleton por defecto: llamarlo varias veces durante
 * la vida de la página devuelve la misma instancia, así que se puede invocar
 * dentro de un componente sin memoizar.
 *
 * Lee y escribe la sesión desde `document.cookie`, que es lo que mantiene
 * sincronizados navegador y servidor: el proxy refresca esas mismas cookies.
 *
 * ```tsx
 * "use client";
 * import { createClient } from "@/lib/supabase/client";
 *
 * const supabase = createClient();
 * const { data } = await supabase.from("learning_items").select();
 * ```
 */
export function createClient() {
  const { url, anonKey } = supabaseEnv();

  return createBrowserClient<Database>(url, anonKey);
}

/** Cliente tipado con el esquema real de la base de datos. */
export type SupabaseBrowserClient = ReturnType<typeof createClient>;
