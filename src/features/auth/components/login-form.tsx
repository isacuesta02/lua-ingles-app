"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction } from "../server/actions";
import { initialAuthFormState } from "../types";

import { Field } from "./field";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialAuthFormState,
  );

  return (
    <form
      action={formAction}
      // `noValidate` apaga los globos nativos del navegador, que no son
      // consistentes entre navegadores ni se anuncian bien. Los atributos
      // `required`/`type` se mantienen porque sí los expone el árbol de
      // accesibilidad; quien valida de verdad es el servidor.
      noValidate
      className="flex flex-col gap-4"
      aria-busy={pending}
    >
      <FormMessage state={state} />

      <Field
        id="login-email"
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        defaultValue={state.values["email"]}
        errors={state.fieldErrors["email"]}
      />

      <Field
        id="login-password"
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        errors={state.fieldErrors["password"]}
      />

      <SubmitButton pending={pending} pendingLabel="Entrando…">
        Iniciar sesión
      </SubmitButton>

      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        ¿Todavía no tienes cuenta?{" "}
        <Link
          href="/signup"
          className="font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Crear una
        </Link>
      </p>
    </form>
  );
}
