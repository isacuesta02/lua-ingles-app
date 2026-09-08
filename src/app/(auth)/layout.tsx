import type { ReactNode } from "react";

/**
 * Marco de las pantallas de auth: una columna centrada, cómoda en móvil y con
 * ancho máximo en pantallas grandes.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-5 py-10">
      {children}
    </main>
  );
}
