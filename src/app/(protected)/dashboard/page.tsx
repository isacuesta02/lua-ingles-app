import type { Metadata } from "next";

import { SignOutButton, requireUser } from "@/features/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Inicio",
};

/**
 * Placeholder. Existe para tener algo detrás del guard y poder comprobar el
 * flujo de auth de punta a punta; el panel real se construye en
 * `src/features/progress`.
 */
export default async function DashboardPage() {
  const user = await requireUser();

  // Lee el perfil que creó el trigger `handle_new_user` al registrarse.
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, cefr_level_estimate")
    .eq("id", user.id)
    .single();

  return (
    <>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Hola{profile?.display_name ? `, ${profile.display_name}` : ""}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {user.email}
          </p>
        </div>
        <SignOutButton />
      </header>

      <dl className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <dt className="text-sm text-neutral-600 dark:text-neutral-400">
          Nivel estimado
        </dt>
        <dd className="text-lg font-medium">
          {profile?.cefr_level_estimate ?? "—"}
        </dd>
      </dl>
    </>
  );
}
