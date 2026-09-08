/**
 * Campo de formulario accesible.
 *
 * Se encarga del cableado ARIA que es fácil olvidar campo por campo:
 * - `label` asociada por `htmlFor`/`id`.
 * - `aria-describedby` apuntando a la pista y/o al error, en ese orden.
 * - `aria-invalid` solo cuando hay error de verdad.
 * - Foco visible con `focus-visible`, sin quitar el outline por defecto.
 */
type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  defaultValue?: string | undefined;
  errors?: string[] | undefined;
  hint?: string | undefined;
  required?: boolean;
  minLength?: number | undefined;
};

export function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  defaultValue,
  errors,
  hint,
  required = true,
  minLength,
}: FieldProps) {
  const hasError = errors !== undefined && errors.length > 0;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy =
    [hint ? hintId : null, hasError ? errorId : null]
      .filter((value) => value !== null)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {hint ? (
        <p
          id={hintId}
          className="text-xs text-neutral-600 dark:text-neutral-400"
        >
          {hint}
        </p>
      ) : null}

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={describedBy}
        className={[
          "w-full rounded-lg border px-3 py-2.5 text-base",
          // 16px de base evita que iOS haga zoom al enfocar el campo.
          "bg-background text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          hasError
            ? "border-red-600 focus-visible:outline-red-600 dark:border-red-500 dark:focus-visible:outline-red-500"
            : "border-neutral-300 focus-visible:outline-blue-600 dark:border-neutral-700 dark:focus-visible:outline-blue-400",
        ].join(" ")}
      />

      {hasError ? (
        <p
          id={errorId}
          className="text-sm text-red-700 dark:text-red-400"
          // El mensaje ya se anuncia al enfocar el campo vía aria-describedby;
          // no lleva role="alert" para no duplicar el anuncio.
        >
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}
