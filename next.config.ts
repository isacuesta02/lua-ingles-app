import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tipa los `href` de `next/link` y los métodos de `next/navigation` contra
  // las rutas que existen de verdad. Requiere TypeScript.
  typedRoutes: true,
};

export default nextConfig;
