"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

import { loginSchema, signupSchema } from "../lib/schemas";
import type { AuthFormState } from "../types";

/**
 * Server Actions de autenticación.
 *
 * `redirect()` lanza una excepción `NEXT_REDIRECT` por diseño, así que siempre
 * se llama al final y nunca dentro de un `try`.
 */

function invalid(
  previous: AuthFormState,
  fieldErrors: Record<string, string[] | undefined>,
  values: Record<string, string>,
): AuthFormState {
  return {
    message: "Revisa los campos marcados.",
    tone: "error",
    fieldErrors,
    values,
    attempt: previous.attempt + 1,
  };
}

function failed(
  previous: AuthFormState,
  message: string,
  values: Record<string, string>,
  tone: "error" | "notice" = "error",
): AuthFormState {
  return {
    message,
    tone,
    fieldErrors: {},
    values,
    attempt: previous.attempt + 1,
  };
}

export async function signInAction(
  previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // El correo se conserva para repoblar el campo; la contraseña nunca.
  const submittedEmail = String(formData.get("email") ?? "").trim();

  if (!parsed.success) {
    return invalid(previous, z.flattenError(parsed.error).fieldErrors, {
      email: submittedEmail,
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Mensaje deliberadamente genérico: decir "ese correo no existe" permitiría
    // a cualquiera averiguar qué correos están registrados.
    return failed(
      previous,
      "Correo o contraseña incorrectos. Inténtalo de nuevo.",
      { email: submittedEmail },
    );
  }

  // Los layouts cachean el usuario; hay que invalidarlos para que vean la
  // sesión nueva.
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(
  previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });

  const submitted = {
    email: String(formData.get("email") ?? "").trim(),
    displayName: String(formData.get("displayName") ?? "").trim(),
  };

  if (!parsed.success) {
    return invalid(
      previous,
      z.flattenError(parsed.error).fieldErrors,
      submitted,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // Esto es lo que Postgres recibe como `raw_user_meta_data`. El trigger
      // `handle_new_user` lee justamente `->>'display_name'`, así que la clave
      // tiene que llamarse así: la app no inserta en `profiles` por su cuenta.
      data: { display_name: parsed.data.displayName },
    },
  });

  if (error) {
    return failed(
      previous,
      error.message === "User already registered"
        ? "Ya existe una cuenta con ese correo. Inicia sesión."
        : "No se pudo crear la cuenta. Inténtalo de nuevo en un momento.",
      submitted,
    );
  }

  // Si el proyecto tiene activada la confirmación por correo, `signUp` no
  // devuelve sesión: la cuenta existe pero aún no se puede entrar.
  if (!data.session) {
    return failed(
      previous,
      "Cuenta creada. Te enviamos un correo para confirmar tu dirección; ábrelo y vuelve a iniciar sesión.",
      submitted,
      "notice",
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
