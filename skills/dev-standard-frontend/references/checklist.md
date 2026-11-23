# Checklist de entrega (base de las futuras reglas de validación)

Revisar antes de presentar código a Marcos. Cada punto es verificable.

## Reutilización y centralización (bloqueante)
- [ ] Busqué en `shared/`, `common/`, `utils/`, `styles/` y features vecinas antes de crear algo.
- [ ] No hay lógica, estilo, validación, mensaje de error, mapeo o configuración duplicados.
- [ ] Lo reutilizable está en la capa central y la respuesta lista `Reutilizado:` / `Nuevo (central):`.
- [ ] Ninguna variante "casi igual" de algo existente; se generalizó el original.
- [ ] Un componente usado en 2+ features está en `shared/`.

## Formato
- [ ] Una línea en blanco entre métodos; sin dobles en blanco.
- [ ] Miembros agrupados: signals → inputs → outputs → injects → constructor/hooks → métodos; alfabético dentro de cada grupo.
- [ ] Prettier aplicado (`singleQuote`, `trailingComma: all`).
- [ ] Sin código comentado, `console.log`, `delay` de demo, TODOs huérfanos ni typos en nombres.
- [ ] Imports por alias / barrels; sin rutas relativas profundas.

## Angular
- [ ] Standalone, `input()/output()`, `inject()`, `@if/@for`, `OnPush`.
- [ ] Datos con `rxResource`/`resource`/`toSignal`; sin `subscribe` innecesario.
- [ ] Errores y mensajes centralizados (servicio / `FormUtils`).
- [ ] Interfaz API separada del modelo propio + mapper.
- [ ] Gráficos solo con `app-chart` + ECharts, sin colores propios.

## Responsive (bloqueante)
- [ ] Verificado a 360px, 375px, tablet y escritorio; sin scroll horizontal.
- [ ] Espaciados y tamaños de texto escalan por breakpoint; objetivos táctiles ≥ 44px.
- [ ] Colores, fuentes y breakpoints salen de `src/styles/` (sin valores sueltos).
- [ ] Si se tocó un breakpoint: `_breakpoints.scss` y `@theme` de Tailwind coinciden.

## Verificación
- [ ] Leí AGENTS.md/CLAUDE.md, versiones y scripts reales antes de implementar (sin asumir versiones mínimas).
- [ ] Identifiqué quién consume el contrato del flujo que modifiqué y lo verifiqué desde su punto de entrada.
- [ ] Si el cambio es de formulario/móvil: probé con teclado virtual real, o dije que solo fue emulación.
- [ ] Ejecuté build, lint y tests existentes (o dije cuáles no pude correr).
- [ ] Añadí unitarias de la lógica nueva y e2e del flujo afectado.
- [ ] Pedí aprobación antes de migraciones, borrados, dependencias nuevas o cambios de contrato.
- [ ] Ante una discrepancia entre la skill y el código de la feature, pregunté en vez de decidir.
- [ ] Probé la ruta/endpoint real, permisos y estados de error.
- [ ] Si cambié persistencia: probé con datos existentes y reintentos; esquema compatible con despliegue escalonado.
- [ ] La entrega explica qué cambió, el motivo técnico y las comprobaciones.

## Modernidad
- [ ] Validé la versión real de cada pieza y usé las prácticas de esa versión (nada deprecado, sin mínimos impuestos).
- [ ] Las técnicas modernas quedaron colocadas en la estructura y el orden de la skill (reubicadas, no reprogramadas).
- [ ] Mejoras sobre código existente propuestas aparte, no coladas en la tarea.
- [ ] Entrega con la línea `Modernidad: …` (adoptado / adaptado / descartado / sin contrastar).

## Seguridad
- [ ] Sin secretos en código, compose ni README; `.env` ignorado.
