import type { Metadata } from "next";

import { SignupForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">Crear cuenta</h1>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        Empieza a estudiar inglés a tu ritmo.
      </p>
      <SignupForm />
    </>
  );
}
