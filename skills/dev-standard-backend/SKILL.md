---
name: dev-standard-backend
description: Estándar de desarrollo backend personal de Marcos para proyectos NestJS (monolito modular o microservicios), limitada al mundo backend y adaptada a la tecnología real de cada proyecto. Úsala siempre que se cree, modifique o revise código Nest, se genere un módulo, servicio, controller, DTO, guard o acceso a datos, se planifique un MVP o entregable backend, o se inicie un proyecto backend nuevo. Impone reutilización obligatoria de código existente, centralización, orden de miembros de clase y contratos explícitos.
---

# Estándar de desarrollo backend (dev-standard-backend)

## Indicador de ejecución (obligatorio)

Cada vez que esta skill se active, la **primera línea** de la respuesta al usuario debe ser exactamente este banner, sin cambios, antes de cualquier otro texto:

```text
▰▰▰ ✦ Mark backend skill ✦ ▰▰▰
```

Es la señal visual de que la skill está en ejecución. Si el banner no aparece, la skill no se cargó. Mostrarlo una vez por respuesta, no en cada mensaje intermedio de herramientas.

Código simple, centralizado, escalable y legible. Marcos aprueba el código en primera instancia, así que debe leerse rápido y verse siempre igual entre proyectos. Se limita al backend: no define frontend ni diseño de pantallas, y se adapta a la versión y tecnologías reales de cada proyecto. Su objetivo es que, ante cualquier indicación, el código salga **como lo escribiría Marcos**: misma estructura, mismo orden y mismo criterio de reutilización.

## Ahorro de tokens — ponytail (obligatorio)

Todo proceso extenso (módulo o endpoint nuevo, refactor, revisión o auditoría, cambio que toque varios archivos, planificación de un entregable) pasa por la skill `ponytail` **antes de escribir código o plan**: invocarla con `Skill` y seguir sus reglas (cambio mínimo completo, reutilizar antes de crear, respuesta corta). Nivel `full` por defecto.

- Ponytail decide el **tamaño** de la solución; esta skill decide la **forma**. Si chocan, gana esta skill (estructura por tipo, orden de miembros, centralización, contratos explícitos), y ponytail recorta todo lo demás.
- Ponytail nunca recorta: reutilización de la Regla 0, validación en bordes de confianza, manejo de errores que evita pérdida de datos, seguridad ni lo que Marcos pidió.
- Tareas triviales (un texto, un nombre, un ajuste puntual) se hacen directo, sin invocarla.

## Paso 1 — Partir del repositorio (siempre)

Antes de tocar nada: leer `AGENTS.md`/`CLAUDE.md`, `package.json`, el lockfile, el bootstrap de Nest (`main.ts`, `app.module.ts`) y los módulos que participan en la tarea. Identificar la **versión real** de Nest, Prisma (u otro ORM), Node, el gestor de paquetes y el runner de tests, y usar los scripts y convenciones existentes. Si el repo ya tiene una convención distinta a esta skill, **gana el repo** y se avisa de la diferencia; esta skill manda en proyectos nuevos y en código nuevo cuando no choca.

**No fijar versiones por costumbre.** Detectar la versión real (campo `packageManager`, lockfile). Esta skill no impone un mínimo global: usa las APIs y prácticas recomendadas para la versión del repo.

**Antes de modificar un flujo existente**, identificar quién consume su contrato (respuesta HTTP, DTO, permisos, efectos de una transición de estado) y verificar desde el punto de entrada habitual las variantes afectadas. Es la regla de mayor impacto de esta skill.

Seguir el flujo cerca de la tarea (endpoint → módulo → servicio → persistencia), identificar quién usa la pieza y qué comportamiento debe conservarse, e implementar un cambio acotado de extremo a extremo. Si hay varias arquitecturas posibles, recomendar una con el porqué, apoyada en un ejemplo del repo.

## Flujo de un entregable (MVP) — obligatorio

Cualquier entregable (endpoint, módulo, servicio) sigue tres fases con aprobación de Marcos entre cada una; detalle en [references/flujo-mvp.md](references/flujo-mvp.md):

1. **Planificar** con la skill `writing-plans` de Superpowers (siempre), incluyendo el **contrato propuesto** (endpoints, DTOs, permisos, errores) aprobado antes de codificar.
2. **Construir y afinar en local** en ida y vuelta: mostrar el resultado, recibir correcciones, repetir. **Sin pruebas unitarias ni e2e en esta fase.**
3. **Pruebas** (unitarias + e2e) solo cuando Marcos diga que el MVP está listo.

## Regla 0 — Antes de escribir, buscar (OBLIGATORIA)

**Nunca se implementa algo sin comprobar primero que no exista.** Si existe, se reutiliza. Siempre.

Antes de crear cualquier módulo, servicio, DTO, guard, decorator, filtro, helper, constante o función:

1. Buscar con Grep/Glob en `common/`, `config/` y en los módulos vecinos, por nombre **y** por comportamiento (no solo por nombre exacto).
2. Si existe y sirve → **reutilizarlo tal cual**.
3. Si existe pero le falta algo → **generalizarlo/extenderlo** (parámetro, opción) en su ubicación central. No copiar ni crear una variante paralela.
4. Si no existe → crearlo directamente en la capa central (`common/`, `config/`) cuando pueda servir a 2+ lugares; si es claramente específico de un módulo, en el módulo, pero con forma extraíble.
5. Declarar en la respuesta, en una línea: `Reutilizado: X, Y` o `Nuevo (central): Z — no existía nada similar`.

Duplicar lógica, validaciones, mensajes de error, mapeos o configuración es un defecto aunque funcione. Ver [references/checklist.md](references/checklist.md).

## Principios

- **Centralizar todo = nunca duplicar y que cada comportamiento tenga un dueño**: validaciones, config, errores, paginación, constantes. Un solo lugar por cosa. **No significa subir todo a `common/`**: lo transversal va a `common/`; la regla propia de un dominio se queda en su módulo. El umbral se decide por naturaleza y dependencias de la pieza, no por un número fijo de usos.
- **Simple y eficaz**: el camino más corto que cumpla. Sin abstracciones especulativas, sin capas que no aportan.
- **Moderno, siempre dentro de mi estructura**: la skill define la estructura; la modernidad se decide por la versión real del proyecto según [references/modernidad.md](references/modernidad.md). Lo que la skill nombra (Joi, class-validator, Prisma) son ejemplos de base, no una lista cerrada: usar eso o lo más moderno que lo reemplace.
- **Sin ruido**: nada de código comentado, notas de "forma antigua/alternativa", `console.log` ni TODOs huérfanos. Los comentarios solo explican un *porqué* no obvio, en español y breves.

## Formato de código

- Prettier: `singleQuote: true`, `trailingComma: "all"`, 2 espacios, `;`.
- **Una línea en blanco entre cada método.** Sin líneas en blanco dobles.
- Archivos en `kebab-case`; clases en `PascalCase`; nombres en inglés.
- Barrels `index.ts` en `dto/`, `config/`, `common/`, `decorators/`.
- Nombres correctos y sin typos (se revisa: `RpcCustomExceptionFilter`, `loginUser`).

### Orden de miembros de una clase

Los miembros se agrupan por tipo, **cada grupo ordenado alfabéticamente**, separados por una línea en blanco: propiedades `private readonly` (injects) agrupadas, luego el constructor, luego los métodos (públicos primero, luego `private`/`protected`), separados por línea en blanco.

## Guías por área (leer la que aplique)

| Tarea | Leer |
|---|---|
| Planificar o construir un entregable/MVP (plan, contrato, ciclo local, pruebas) | [references/flujo-mvp.md](references/flujo-mvp.md) |
| Backend Nest (módulos, DTOs, config, errores, paginación, datos) | [references/nest-backend.md](references/nest-backend.md) |
| Gateway + microservicios NATS | [references/nest-microservices.md](references/nest-microservices.md) |
| Modernidad: versión, APIs actuales, buenas prácticas, herramientas opcionales | [references/modernidad.md](references/modernidad.md) |
| Docker, .env, secretos, scripts | [references/infra.md](references/infra.md) |
| Revisión antes de entregar | [references/checklist.md](references/checklist.md) |
| Llevar la skill a otro equipo e instalar herramientas opcionales (con aprobación) | [setup/INSTALAR.md](setup/INSTALAR.md) |
| Reglas automatizables, fallos típicos de IA y puntos aún por confirmar | [references/validacion-futura.md](references/validacion-futura.md) |

Plantillas listas para copiar (envs Joi, paginación, filtro RPC): carpeta [templates/](templates/). **Primero comprobar si el proyecto ya tiene su versión** (Regla 0); si la tiene, usar esa.

## Proyecto nuevo

1. `config/envs.ts` (Joi) + `.env.template` + `common/` (paginación, filtro de errores) + bootstrap estándar.
2. Copiar solo las plantillas necesarias; no inventar estructura distinta.

## Aprobación previa y conflictos (confirmado por Marcos)

**Detenerse y pedir aprobación explícita antes de:**
- migraciones de base de datos y cualquier borrado de datos o archivos;
- instalar o actualizar dependencias;
- cambios de contrato (respuestas HTTP, DTOs, permisos, estados que otros consumen).

Explicar qué se hará, el impacto y a quién afecta, y esperar el sí. Commits, push y despliegues solo cuando Marcos los pida.

**Si la convención de esta skill y el código consolidado de un módulo discrepan: preguntar a Marcos cada vez.** Describir la discrepancia (qué dice la skill, qué hace el código, qué opción recomiendo) y no decidir solo ni reescribir lo existente por iniciativa propia.

## Verificar antes de entregar

Durante la construcción solo se exige que compile y se pueda probar en local; **las pruebas unitarias y e2e se hacen únicamente después de que Marcos diga que el MVP está listo** (ver [references/flujo-mvp.md](references/flujo-mvp.md)). Con su OK: unitarias de la lógica nueva y e2e de los endpoints afectados, con el runner que ya tenga el repo o, si no hay, el recomendado y compatible con la versión de Nest detectada (sin fijar uno por costumbre; instalar dependencias requiere aprobación). Comprobar el endpoint real y las variantes afectadas (permisos, estados de error). Al entregar decir: qué cambió, el motivo técnico, qué se reutilizó y qué comprobaciones se ejecutaron (y cuáles no se pudieron ejecutar).

## Cómo evoluciona esta skill

Es un documento vivo. Cuando Marcos corrija o apruebe un patrón, actualizar la guía correspondiente (no dejar la regla solo en la conversación). El [checklist](references/checklist.md) es la base de las futuras reglas de validación.
