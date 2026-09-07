# Convención de features

Cada carpeta de `src/features/` es un módulo vertical: contiene su UI, su estado
de cliente, su acceso a datos y su lógica de dominio. La organización es **por
feature, no por tipo de archivo**, para que cambiar "cómo funcionan los repasos"
toque una sola carpeta.

## Anatomía

```
src/features/<feature>/
├── components/   Componentes de UI propios del feature
├── hooks/        Estado de cliente ("use client")
├── lib/          Lógica de dominio pura: sin React, sin I/O, testeable
├── server/       Server Actions y acceso a datos ("server-only")
├── types.ts      Tipos del dominio (crear cuando haga falta)
└── index.ts      API pública del feature
```

## Reglas de dependencia

1. **`src/app/` solo enruta.** Las páginas componen features; no contienen
   lógica de negocio.
2. **Se importa por el barrel.** Desde fuera de un feature siempre
   `@/features/srs`, nunca `@/features/srs/lib/scheduler`. Lo que no esté en
   `index.ts` es privado.
3. **Sin ciclos entre features.** Si `reading` y `srs` se necesitan mutuamente,
   lo compartido baja a `src/lib/` o `src/types/`.
4. **`lib/` no importa React ni hace I/O.** Es la parte que se puede testear sin
   levantar la app; ahí viven los algoritmos (scheduling, dificultad, métricas).
5. **`server/` nunca se importa desde un componente de cliente.** Marca esos
   archivos con `import "server-only"` para que el error salte en build.

## Features actuales

| Feature      | Método con evidencia que implementa        |
| ------------ | ------------------------------------------ |
| `srs`        | Repetición espaciada + recuperación activa |
| `reading`    | Input comprensible (lectura)               |
| `listening`  | Input comprensible (audio) + shadowing     |
| `production` | Producción con feedback correctivo         |
| `progress`   | Panel de progreso, sin gamificación        |
| `auth`       | Sesión y usuario actual                    |
