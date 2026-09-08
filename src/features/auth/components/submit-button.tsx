/**
 * Botón de envío con estado de carga.
 *
 * Usa `aria-disabled` en vez de `disabled`: un botón `disabled` desaparece del
 * orden de tabulación, así que si alguien lo tenía enfocado al enviar, el foco
 * se pierde. Con `aria-disabled` el botón sigue enfocable y el `onClick`
 * bloquea el segundo envío.
 */
export function SubmitButton({
  pending,
  children,
  pendingLabel,
}: {
  pending: boolean;
  children: string;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      aria-disabled={pending}
      onClick={(event) => {
        if (pending) event.preventDefault();
      }}
      className={[
        "w-full rounded-lg px-4 py-2.5 text-base font-medium",
        "bg-blue-600 text-white dark:bg-blue-500",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        pending
          ? "cursor-progress opacity-70"
          : "hover:bg-blue-700 dark:hover:bg-blue-600",
      ].join(" ")}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
