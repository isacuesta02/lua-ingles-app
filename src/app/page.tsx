import { redirect } from "next/navigation";

import { AFTER_LOGIN_PATH } from "@/lib/routes";

/**
 * La raíz no tiene contenido propio todavía. Quien llega sin sesión ni siquiera
 * pasa por aquí: `src/proxy.ts` lo manda antes a `/login`.
 */
export default function HomePage() {
  redirect(AFTER_LOGIN_PATH);
}
