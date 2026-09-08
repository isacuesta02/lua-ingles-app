import type { ReactNode } from "react";

import { requireUser } from "@/features/auth";

/**
 * Guard real de las rutas protegidas.
 *
 * `src/proxy.ts` ya redirige a quien no tiene sesión, pero corre antes del
 * render y puede desplegarse en un CDN, así que no sirve como límite de
 * seguridad. Esta comprobación se ejecuta en el servidor, en cada render, y es
 * la que cuenta.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
      {children}
    </main>
  );
}
