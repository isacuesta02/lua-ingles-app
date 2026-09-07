/**
 * Metadatos de la app en un solo sitio, para no repetirlos entre `layout.tsx`,
 * el manifest y las etiquetas de Open Graph.
 */
export const siteConfig = {
  name: "Lua",
  description:
    "App personal para aprender inglés con métodos respaldados por evidencia: repetición espaciada, recuperación activa, input comprensible y producción con feedback.",
  locale: "es-CO",
} as const;

export type SiteConfig = typeof siteConfig;
