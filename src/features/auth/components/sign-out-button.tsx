"use client";

import { useActionState } from "react";

import { signOutAction } from "../server/actions";

/**
 * `useActionState` con estado `void` sirve solo para obtener `pending`; la
 * acción redirige, así que no hay nada que devolver.
 */
export function SignOutButton() {
  const [, formAction, pending] = useActionState(async () => {
    await signOutAction();
  }, undefined);

  return (
    <form action={formAction}>
      <button
        type="submit"
        aria-disabled={pending}
        onClick={(event) => {
          if (pending) event.preventDefault();
        }}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        {pending ? "Cerrando sesión…" : "Cerrar sesión"}
      </button>
    </form>
  );
}
