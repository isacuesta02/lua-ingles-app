/**
 * Estado que las Server Actions de auth devuelven a `useActionState`.
 */
export type AuthFormState = {
  /** Mensaje general del formulario (credenciales, fallo de red, aviso). */
  message: string | null;
  /** `error` pinta en rojo; `notice` es informativo (p. ej. "revisa tu correo"). */
  tone: "error" | "notice";
  /** Errores por campo, con la misma forma que `z.flattenError().fieldErrors`. */
  fieldErrors: Record<string, string[] | undefined>;
  /** Valores para repoblar el formulario. Nunca incluye contraseñas. */
  values: Record<string, string>;
  /**
   * Se incrementa en cada envío. Sirve para que el resumen de errores vuelva a
   * recibir foco y a anunciarse aunque el mensaje sea idéntico al anterior.
   */
  attempt: number;
};

export const initialAuthFormState: AuthFormState = {
  message: null,
  tone: "error",
  fieldErrors: {},
  values: {},
  attempt: 0,
};
