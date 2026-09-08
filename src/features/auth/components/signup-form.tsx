"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpAction } from "../server/actions";
import { initialAuthFormState } from "../types";

import { Field } from "./field";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialAuthFormState,
  );

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-4"
      aria-busy={pending}
    >
      <FormMessage state={state} />

      <Field
        id="signup-display-name"
        name="displayName"
        label="¿Cómo te llamamos?"
        autoComplete="given-name"
        defaultValue={state.values["displayName"]}
        errors={state.fieldErrors["displayName"]}
      />

      <Field
        id="signup-email"
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        defaultValue={state.values["email"]}
        errors={state.fieldErrors["email"]}
      />

      <Field
        id="signup-password"
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        minLength={8}
        hint="Mínimo 8 caracteres."
        errors={state.fieldErrors["password"]}
      />

      <SubmitButton pending={pending} pendingLabel="Creando cuenta…">
        Crear cuenta
      </SubmitButton>

      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
