# Lua — App para aprender inglés

App web personal, **mobile-first**, construida sobre métodos de aprendizaje con
respaldo científico:

| Método                   | Idea                                                      | Feature                |
| ------------------------ | --------------------------------------------------------- | ---------------------- |
| Repetición espaciada     | Repasar justo antes de olvidar                            | `srs`                  |
| Práctica de recuperación | Recordar activamente en lugar de releer                   | `srs`                  |
| Input comprensible (i+1) | Leer y escuchar algo un punto por encima del nivel actual | `reading`, `listening` |
| Shadowing                | Imitar audio nativo en fragmentos cortos y repetidos      | `listening`            |
| Producción con feedback  | Escribir/hablar y recibir corrección explicada            | `production`           |

**Restricción de producto: sin gamificación.** Nada de puntos, XP, niveles,
insignias, rachas ni tablas de clasificación. El panel de progreso solo muestra
métricas que ayudan a decidir qué estudiar mañana (retención real, ítems que
cuestan, minutos por método, volumen de input).

## Requisitos

- **Node.js 20.9+** (recomendado 22 LTS)
- **npm 10+**

Verifica tu versión con `node -v`.

## Levantar el proyecto localmente

```bash
# 1. Instalar dependencias (también instala los hooks de Git vía `prepare`)
npm install

# 2. Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> Si clonas el repo y los hooks no se activan, ejecuta `npm run prepare` una vez.

## Scripts

| Script                 | Qué hace                                                         |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con hot reload                            |
| `npm run build`        | Build de producción (incluye type-check de las rutas)            |
| `npm start`            | Sirve el build de producción (requiere `build` previo)           |
| `npm run lint`         | ESLint sobre todo el proyecto                                    |
| `npm run lint:fix`     | ESLint aplicando correcciones automáticas                        |
| `npm run format`       | Prettier reformatea todo el proyecto                             |
| `npm run format:check` | Falla si algo no está formateado (útil en CI)                    |
| `npm run typecheck`    | `tsc --noEmit` sobre todo el proyecto                            |
| `npm run check`        | typecheck + lint + format:check — lo mismo que debería correr CI |

## Estructura del proyecto

Organizada **por feature**, no por tipo de archivo: cambiar "cómo funcionan los
repasos" toca una sola carpeta.

```
src/
├── app/                  App Router: SOLO enrutado y layouts. Sin lógica de negocio.
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── features/             Módulos verticales del dominio
│   ├── auth/             Sesión y usuario actual
│   ├── srs/              Repetición espaciada + recuperación activa
│   ├── reading/          Input comprensible escrito
│   ├── listening/        Escucha activa y shadowing
│   ├── production/       Escritura/habla con feedback correctivo
│   └── progress/         Panel de progreso (sin gamificación)
├── components/
│   ├── ui/               Primitivas del design system (Button, Card, Sheet…)
│   └── layout/           Estructura compartida (nav inferior, contenedores)
├── hooks/                Hooks genéricos, reutilizables entre features
├── lib/                  Utilidades transversales (fechas, fetch, formateo)
├── config/               Configuración estática de la app
└── types/                Tipos compartidos entre features
```

Cada feature sigue la misma anatomía interna:

```
src/features/<feature>/
├── components/   UI propia del feature
├── hooks/        Estado de cliente ("use client")
├── lib/          Lógica de dominio pura: sin React, sin I/O, testeable
├── server/       Server Actions y acceso a datos ("server-only")
├── types.ts      Tipos del dominio
└── index.ts      API pública del feature
```

Las reglas de dependencia entre features están en
[`src/features/README.md`](src/features/README.md). La principal: **desde fuera
se importa siempre por el barrel** (`@/features/srs`), nunca un archivo interno.
ESLint lo hace cumplir con `no-restricted-imports`.

El alias `@/*` apunta a `src/*`.

## Tooling

### TypeScript

`strict: true` más tres opciones que atrapan bugs reales en este dominio:

- `noUncheckedIndexedAccess` — indexar un array devuelve `T | undefined`.
  Importante al recorrer colas de repaso y fragmentos de audio.
- `noImplicitOverride` y `noFallthroughCasesInSwitch`.
- `allowJs: false` — el proyecto es TypeScript de punta a punta.

### ESLint + Prettier

Trabajan **separados, no anidados**, que es la forma que no genera conflictos:

- **ESLint** se ocupa de la corrección del código (reglas de Next, React Hooks,
  TypeScript, fronteras entre features).
- **Prettier** se ocupa solo del formato.
- `eslint-config-prettier` va **al final** de `eslint.config.mjs` y apaga las
  reglas de ESLint que opinan sobre formato, para que no peleen.

No se usa `eslint-plugin-prettier`: correr Prettier _dentro_ de ESLint mezcla
errores de formato con errores de código y hace el lint más lento.

`prettier-plugin-tailwindcss` ordena automáticamente las clases de Tailwind. Con
Tailwind v4 no hay `tailwind.config.js`, así que el plugin lee el tema desde
`src/app/globals.css` (opción `tailwindStylesheet` en `.prettierrc.json`).

### Hooks de Git

`husky` + `lint-staged` corren **solo sobre los archivos en el stage** antes de
cada commit:

- `*.{ts,tsx}` → `eslint --fix --max-warnings=0` y luego `prettier --write`
- resto de archivos formateables → `prettier --write`

Si ESLint encuentra algo que no puede arreglar solo, el commit se aborta.

El type-check **no** está en el hook a propósito: `tsc` sobre todo el proyecto
hace el commit lento y no puede limitarse a archivos sueltos. Va en
`npm run check` / CI.

## Estado actual

Solo la base del proyecto: estructura, tooling y convenciones. Todavía no hay
funcionalidad de negocio implementada — las carpetas de cada feature están
vacías a la espera de su primera implementación.

Próximos pasos naturales:

1. Elegir persistencia (SQLite + Drizzle/Prisma encaja bien en una app personal).
2. Implementar el algoritmo de scheduling en `src/features/srs/lib/`.
3. Montar la navegación mobile-first en `src/components/layout/`.
