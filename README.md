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

# 2. Configurar las variables de entorno
cp .env.example .env.local
# Rellena .env.local con los valores de Supabase → Project Settings → API

# 3. Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> Si clonas el repo y los hooks no se activan, ejecuta `npm run prepare` una vez.

### Variables de entorno

| Variable                        | De dónde sale                              |
| ------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API → URL    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` |

Ambas son `NEXT_PUBLIC_`, o sea que viajan al navegador. Es lo correcto para la
clave `anon`: quien protege los datos es **Row Level Security** en Supabase, no
el secreto de la clave. Si algún día hace falta la `service_role`, va sin
prefijo `NEXT_PUBLIC_` y solo se usa desde `server/`.

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
├── lib/
│   ├── database.types.ts Tipos generados desde el esquema real de Supabase
│   └── supabase/         Clientes de Supabase (ver abajo)
├── config/               Configuración estática de la app
├── types/                Tipos compartidos entre features
└── proxy.ts              Refresco de sesión en cada request
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

## Supabase

Toda la configuración vive en `src/lib/supabase/`, con `@supabase/ssr`. Hay un
cliente por entorno de ejecución porque cada uno accede a las cookies de forma
distinta:

| Archivo      | Dónde se usa                                      | Cómo se usa                                  |
| ------------ | ------------------------------------------------- | -------------------------------------------- |
| `client.ts`  | Client Components                                 | `createClient()` — síncrono, singleton       |
| `server.ts`  | Server Components, Server Actions, Route Handlers | `await createClient()` — **uno por request** |
| `session.ts` | Solo desde `src/proxy.ts`                         | `updateSession(request)`                     |
| `env.ts`     | Interno                                           | Valida las variables con un error legible    |

Los tres van tipados con `Database` de `src/lib/database.types.ts`, así que
`supabase.from("learning_items").select()` devuelve filas tipadas y una tabla
inexistente es un error de compilación.

### Por qué hace falta el proxy

Un Server Component **no puede escribir cookies**. Cuando el token de acceso
caduca, alguien tiene que refrescarlo y guardar el nuevo antes de que se
renderice la página; ese alguien es `src/proxy.ts`. Sin él aparecen deslogueos
intermitentes difíciles de depurar.

`server.ts` refleja eso: su `setAll` va envuelto en un `try/catch` porque en un
Server Component la escritura lanza, y ahí es seguro ignorarla — el proxy ya se
encargó.

### `proxy.ts`, no `middleware.ts`

En **Next.js 16 el convenio `middleware.ts` está deprecado y renombrado a
`proxy.ts`**, con la función exportada llamada `proxy`. `middleware.ts` todavía
funciona pero emite un aviso de deprecación en el build. La mayoría de guías de
Supabase que encontrarás online siguen usando `middleware.ts`: son válidas en
contenido, solo cambia el nombre del archivo y de la función.

### Regenerar los tipos

```bash
npx supabase gen types typescript --linked > src/lib/database.types.ts
```

Es un archivo generado: está en `.prettierignore` y no se edita a mano.

### Autorización

El proxy **solo refresca la sesión**; no protege rutas. La comprobación de
acceso va en los layouts de servidor y, sobre todo, en **Row Level Security** en
Postgres. El proxy corre antes del render y puede desplegarse en un CDN, así que
no es un sitio fiable para decidir quién ve qué.

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
