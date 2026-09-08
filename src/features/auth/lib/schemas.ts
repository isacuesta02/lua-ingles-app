import { z } from "zod";

/**
 * Esquemas de validación de los formularios de auth.
 *
 * Viven en `lib/` porque son lógica pura: sin React y sin I/O. La validación
 * que manda es la del servidor (las Server Actions los usan); los atributos
 * HTML de los inputs son solo una ayuda visual temprana y se pueden saltar.
 */

const email = z
  .string()
  .trim()
  // Se comprueba primero que no esté vacío para dar un mensaje mejor que
  // "correo inválido" cuando la persona simplemente no ha escrito nada.
  .min(1, "Escribe tu correo electrónico.")
  .pipe(
    z.email("Ese correo no parece válido. Revisa que tenga @ y un dominio."),
  );

const password = z
  .string()
  .min(1, "Escribe tu contraseña.")
  .min(8, "La contraseña debe tener al menos 8 caracteres.");

export const loginSchema = z.object({
  email,
  // En login no se exige longitud mínima: la contraseña puede ser antigua y el
  // único veredicto que importa es el de Supabase.
  password: z.string().min(1, "Escribe tu contraseña."),
});

export const signupSchema = z.object({
  email,
  password,
  displayName: z
    .string()
    .trim()
    .min(1, "Escribe cómo quieres que te llamemos.")
    .max(60, "Máximo 60 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
