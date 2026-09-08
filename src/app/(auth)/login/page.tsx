import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">Iniciar sesión</h1>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        Continúa donde lo dejaste.
      </p>
      <LoginForm />
    </>
  );
}
