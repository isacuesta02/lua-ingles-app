/**
 * Lee y valida la configuración pública de Supabase.
 *
 * Next.js sustituye `process.env.NEXT_PUBLIC_*` por su valor literal en tiempo
 * de build, así que las claves tienen que escribirse a mano: un acceso dinámico
 * (`process.env[nombre]`) queda como `undefined` en el bundle del navegador.
 *
 * La validación ocurre al crear el cliente, no al importar el módulo, para que
 * un `.env.local` incompleto falle con un mensaje claro en vez de romper el
 * build entero.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example a .env.local y rellénala desde tu proyecto de Supabase (Project Settings → API).`,
    );
  }
  return value;
}

export function supabaseEnv(): { url: string; anonKey: string } {
  return {
    url: required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    anonKey: required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}
