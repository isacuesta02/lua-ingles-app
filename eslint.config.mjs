import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Reglas propias del proyecto.
  {
    name: "lua/rules",
    rules: {
      // Permite `_algo` para descartes intencionales (params, catch, destructuring).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // `import type` explícito: evita que tipos acaben en el bundle.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // Frontera entre features: desde fuera se importa por el barrel `index.ts`.
  // Ver src/features/README.md.
  {
    name: "lua/feature-boundaries",
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/features/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                "Importa desde la API pública del feature (@/features/<nombre>), no desde sus archivos internos.",
            },
          ],
        },
      ],
    },
  },

  // Debe ir al final: apaga las reglas de ESLint que chocan con Prettier.
  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
