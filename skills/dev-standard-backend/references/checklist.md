# Checklist de entrega (base de las futuras reglas de validación)

Revisar antes de presentar código a Marcos. Cada punto es verificable.

## Reutilización y centralización (bloqueante)
- [ ] Busqué en `common/`, `config/` y módulos vecinos antes de crear algo.
- [ ] No hay lógica, validación, mensaje de error, mapeo o configuración duplicados.
- [ ] Lo reutilizable está en la capa central y la respuesta lista `Reutilizado:` / `Nuevo (central):`.
- [ ] Ninguna variante "casi igual" de algo existente; se generalizó el original.

## Formato
- [ ] Una línea en blanco entre métodos; sin dobles en blanco.
- [ ] Miembros agrupados: injects `private readonly` → constructor → métodos; alfabético dentro de cada grupo.
- [ ] Prettier aplicado (`singleQuote`, `trailingComma: all`).
- [ ] Sin código comentado, `console.log`, TODOs huérfanos ni typos en nombres.
- [ ] Barrels `index.ts` en `dto/`, `config/`, `common/`, `decorators/`.

## Nest
- [ ] Config solo desde `envs` (Joi) y `.env.template` actualizado.
- [ ] `ValidationPipe` global; DTOs con validación y barrel.
- [ ] Paginación estándar `page/limit` + `meta`.
- [ ] Errores por filtro/método central; sin `try/catch` repetido.
- [ ] Controllers delgados; sin campos sensibles en respuestas.

## Verificación
- [ ] Leí AGENTS.md/CLAUDE.md, versiones y scripts reales antes de implementar (sin asumir versiones mínimas).
- [ ] Identifiqué quién consume el contrato del flujo que modifiqué y lo verifiqué desde su punto de entrada.
- [ ] El contrato (endpoints, DTOs, permisos, errores) fue aprobado antes de codificar.
- [ ] Ejecuté build, lint y tests existentes (o dije cuáles no pude correr).
- [ ] Las pruebas unitarias y e2e se hicieron **después** del OK de Marcos al MVP (no durante la ida y vuelta local).
- [ ] Pedí aprobación antes de migraciones, borrados, dependencias nuevas o cambios de contrato.
- [ ] Ante una discrepancia entre la skill y el código del módulo, pregunté en vez de decidir.
- [ ] Probé el endpoint real, permisos y estados de error.
- [ ] Si cambié persistencia: probé con datos existentes y reintentos; esquema compatible con despliegue escalonado.
- [ ] La entrega explica qué cambió, el motivo técnico y las comprobaciones.

## Modernidad
- [ ] Validé la versión real de cada pieza y usé las prácticas de esa versión (nada deprecado, sin mínimos impuestos).
- [ ] Las técnicas modernas quedaron colocadas en la estructura y el orden de la skill (reubicadas, no reprogramadas).
- [ ] Mejoras sobre código existente propuestas aparte, no coladas en la tarea.
- [ ] Entrega con la línea `Modernidad: …` (adoptado / adaptado / descartado).

## Seguridad / infra
- [ ] Sin secretos en código, compose ni README; `.env` ignorado.
- [ ] Dockerfile prod multi-stage con `USER node`.
