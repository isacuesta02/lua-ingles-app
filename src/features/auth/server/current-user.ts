import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Usuario autenticado, o `null`.
 *
 * Usa `getUser()`, que valida el token contra el servidor de Auth. Es una
 * llamada de red por render, pero es la fuente de verdad: el usuario que viene
 * de las cookies sin verificar no es de fiar.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  return data.user;
}

/**
 * Igual que `getCurrentUser`, pero manda a `/login` si no hay sesión.
 *
 * Este es el guard de verdad. `src/proxy.ts` también redirige, pero corre antes
 * del render y puede vivir en un CDN, así que no sirve como límite de
 * seguridad: la comprobación tiene que repetirse aquí.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
