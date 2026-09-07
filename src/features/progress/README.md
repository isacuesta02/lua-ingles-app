# Feature: `progress` — Panel de progreso (sin gamificación)

Agrega la actividad de los demás features en una vista honesta del avance. Es
**solo lectura**: no produce eventos, los consume.

## Estructura interna

| Carpeta       | Responsabilidad                                                                      |
| ------------- | ------------------------------------------------------------------------------------ |
| `lib/`        | Agregaciones puras (retención, tiempo por método, tamaño del vocabulario maduro).    |
| `server/`     | Consultas de lectura sobre los datos de `srs`, `reading`, `listening`, `production`. |
| `hooks/`      | Rango de fechas seleccionado y estado de los filtros.                                |
| `components/` | Gráficos y tarjetas de resumen, mobile-first.                                        |
| `types.ts`    | Tipos del dominio (`ProgressSnapshot`, `RetentionPoint`). Créalo cuando haga falta.  |

## Reglas — restricción de producto

**Sin gamificación.** Nada de puntos, XP, niveles, insignias, rachas ni tablas
de clasificación. Lo que sí se muestra:

- Retención real en repasos (% de aciertos por antigüedad del ítem).
- Ítems que están costando y por qué.
- Minutos por método y distribución del tiempo (input vs. producción).
- Volumen de input acumulado (palabras leídas, minutos escuchados).

Si una métrica solo sirve para motivar y no para **decidir qué estudiar
mañana**, no entra en este panel.
