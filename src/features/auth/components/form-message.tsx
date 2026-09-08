"use client";

import { useEffect, useRef } from "react";

import type { AuthFormState } from "../types";

/**
 * Mensaje general del formulario (error de credenciales, aviso de confirmación).
 *
 * Al aparecer, recibe el foco. Sin esto, quien navega con teclado o lector de
 * pantalla se queda al final del formulario sin enterarse de que el envío
 * falló. `attempt` está en las dependencias para que el foco vuelva a moverse
 * aunque el mensaje sea idéntico al del intento anterior.
 */
export function FormMessage({ state }: { state: AuthFormState }) {
  const ref = useRef<HTMLDivElement>(null);
  const { message, tone, attempt } = state;

  useEffect(() => {
    if (message !== null) ref.current?.focus();
  }, [message, attempt]);

  if (message === null) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={tone === "error" ? "alert" : "status"}
      className={[
        "rounded-lg border px-3 py-2.5 text-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        tone === "error"
          ? "border-red-300 bg-red-50 text-red-800 focus-visible:outline-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          : "border-blue-300 bg-blue-50 text-blue-900 focus-visible:outline-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100",
      ].join(" ")}
    >
      {message}
    </div>
  );
}
