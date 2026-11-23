---
name: dev-standard-frontend
description: Estándar de desarrollo frontend personal de Marcos para proyectos Angular (signals, rxjs, Tailwind, ECharts), limitada al mundo frontend y adaptada a la tecnología real de cada proyecto. Úsala siempre que se cree, modifique o revise código Angular, se genere un componente, servicio, gráfico o estilo, o se inicie un proyecto frontend nuevo. Impone reutilización obligatoria de código existente, centralización, orden de miembros de clase, responsive mobile-first y estilos centralizados en SCSS.
---

# Estándar de desarrollo frontend (dev-standard-frontend)

## Indicador de ejecución (obligatorio)

Cada vez que esta skill se active, la **primera línea** de la respuesta al usuario debe ser exactamente este banner, sin cambios, antes de cualquier otro texto:

```text
▰▰▰ ✦ Mark frontend skill ✦ ▰▰▰
```

Es la señal visual de que la skill está en ejecución. Si el banner no aparece, la skill no se cargó. Mostrarlo una vez por respuesta, no en cada mensaje intermedio de herramientas.

Código simple, centralizado, escalable y legible. Marcos aprueba el código en primera instancia, así que debe leerse rápido y verse siempre igual entre proyectos. Se limita al frontend: no define backend, base de datos ni infraestructura, y se adapta a la versión y tecnologías reales de cada proyecto. Su objetivo es que, ante cualquier indicación, el código salga **como lo escribiría Marcos**: misma estructura, mismo orden y mismo criterio de reutilización.

## Paso 1 — Partir del repositorio (siempre)

Antes de tocar nada: leer `AGENTS.md`/`CLAUDE.md`, `package.json`, el lockfile, `angular.json` y las rutas que participan en la tarea. Identificar la **versión real** de Angular, el gestor de paquetes, el runner de tests y la librería visual, y usar los scripts y convenciones existentes. Si el repo ya tiene una convención distinta a esta skill, **gana el repo** y se avisa de la diferencia; esta skill manda en proyectos nuevos y en código nuevo cuando no choca.

**No fijar versiones por costumbre.** Detectar la versión real de Angular, TypeScript, Node y el gestor (campo `packageManager`, lockfile), y si el proyecto usa zoneless o `zone.js`. Esta skill no impone un mínimo global: las APIs que propone (signals, `rxResource`, control flow) se usan solo si la versión del repo las soporta.

**Antes de modificar un flujo existente**, identificar quién consume su contrato (valor de formulario, acceso, respuesta HTTP, efectos de una transición de estado) y verificar desde el punto de entrada habitual las variantes afectadas. Es la regla de mayor impacto de esta skill.

Seguir el flujo cerca de la tarea (ruta → componente → servicio → contrato) e implementar un cambio acotado de extremo a extremo. Si hay varias arquitecturas posibles, recomendar una con el porqué, apoyada en un ejemplo del repo.

## Regla 0 — Antes de escribir, buscar (OBLIGATORIA)

**Nunca se implementa algo sin comprobar primero que no exista.** Si existe, se reutiliza. Siempre.

Antes de crear cualquier componente, servicio, pipe, directiva, util, guard, interceptor, mapper, estilo, token o función:

1. Buscar con Grep/Glob en `shared/`, `core/`, `utils/`, `styles/` y en las features vecinas, por nombre **y** por comportamiento (no solo por nombre exacto).
2. Si existe y sirve → **reutilizarlo tal cual**.
3. Si existe pero le falta algo → **generalizarlo/extenderlo** (input, parámetro, opción) en su ubicación central. No copiar ni crear una variante paralela.
4. Si no existe → crearlo directamente en la capa central (`shared/`, `core/`, `styles/`) cuando pueda servir a 2+ lugares; si es claramente específico de una feature, en la feature, pero con forma extraíble.
5. Declarar en la respuesta, en una línea: `Reutilizado: X, Y` o `Nuevo (central): Z — no existía nada similar`.

Duplicar lógica, estilos, validaciones, textos de error, mapeos o configuración es un defecto aunque funcione. Ver [references/checklist.md](references/checklist.md).

## Principios

- **Centralizar todo = nunca duplicar y que cada comportamiento tenga un dueño**: componentes, comportamientos, config, validaciones, estilos, constantes. Un solo lugar por cosa, para que escalar o extraer a librería sea trivial. **No significa subir todo a `shared/` o `core/`**: la UI con contrato estable y consumidores de varias features va a `shared/`; la infraestructura de aplicación a `core/`; la validación o regla propia de un dominio se queda en su feature aunque la usen varias pantallas de esa feature. El umbral se decide por naturaleza y dependencias de la pieza, no por un número fijo de usos.
- **Simple y eficaz**: el camino más corto que cumpla. Sin abstracciones especulativas, sin capas que no aportan.
- **Moderno, siempre dentro de mi estructura**: la skill define la estructura; la modernidad (APIs, formularios, tests, CSS, semántica) se decide por la versión real del proyecto según [references/modernidad.md](references/modernidad.md). Lo siguiente son ejemplos de base, no una lista cerrada: usar eso o lo más moderno que lo reemplace. Angular standalone + signals + `inject()` + control flow (`@if/@for`) + `rxResource`/`resource`; sin NgModules, sin `*ngIf`, sin decoradores `@Input/@Output` (usar `input()`/`output()`), sin `subscribe` manual cuando un resource/`toSignal`/`async` basta.
- **Responsive es obligatorio**: todo se diseña mobile-first y se valida en móvil (espaciados y tamaños). Ver [references/styles-responsive.md](references/styles-responsive.md).
- **Gráficos = ECharts**, siempre, vía un único componente central. Ver [references/echarts.md](references/echarts.md).
- **Sin ruido**: nada de código comentado, notas de "forma antigua/alternativa", `console.log`, `delay()` de demo ni TODOs huérfanos. Los comentarios solo explican un *porqué* no obvio, en español y breves.

## Formato de código

- Prettier: `singleQuote: true`, `trailingComma: "all"`, 2 espacios, `;`.
- **Una línea en blanco entre cada método.** Sin líneas en blanco dobles.
- Archivos en `kebab-case`; clases en `PascalCase`; nombres en inglés, textos de UI en español.
- Imports con alias de path (`@auth/...`, `@shared/...`).
- Nombres correctos y sin typos.

### Orden de miembros de una clase

Los miembros se agrupan por tipo, **cada grupo ordenado alfabéticamente**, y los grupos en este orden, separados por una línea en blanco:

1. **signals** (`signal`, `computed`, `linkedSignal`, `resource`, `rxResource`, `toSignal`)
2. **inputs** (`input`, `input.required`, `model`)
3. **outputs** (`output`)
4. **injects** (`inject(...)`)
5. otros campos que dependen de un inject (p. ej. `form = this.fb.group(...)`): van justo después de los injects
6. constructor / lifecycle hooks
7. métodos (públicos primero, luego `private`/`protected`), separados por línea en blanco

Excepción documentada: si un signal usa un inject de forma *inmediata* (p. ej. `toSignal(this.route.queryParamMap...)`) el inject debe declararse antes; hacerlo perezoso (`computed`/`loader`) para no romper el orden, y si no es posible, subir ese inject y comentar por qué en una línea.

## Guías por área (leer la que aplique)

| Tarea | Leer |
|---|---|
| Frontend Angular (estructura, rutas, signals, servicios, forms) | [references/angular-frontend.md](references/angular-frontend.md) |
| Estilos, breakpoints, tokens, responsive | [references/styles-responsive.md](references/styles-responsive.md) |
| Cualquier gráfico | [references/echarts.md](references/echarts.md) |
| Modernidad: versión, APIs actuales, buenas prácticas, herramientas opcionales | [references/modernidad.md](references/modernidad.md) |
| Llevar la skill a otro equipo e instalar herramientas opcionales (con aprobación) | [setup/INSTALAR.md](setup/INSTALAR.md) |
| Entorno, git y gestor de paquetes del frontend | [references/infra.md](references/infra.md) |
| Revisión antes de entregar | [references/checklist.md](references/checklist.md) |
| Reglas automatizables, fallos típicos de IA y puntos aún por confirmar | [references/validacion-futura.md](references/validacion-futura.md) |

Plantillas listas para copiar (partials SCSS, wrapper ECharts, form utils, e2e, Playwright): carpeta [templates/](templates/). **Primero comprobar si el proyecto ya tiene su versión** (Regla 0); si la tiene, usar esa.

## Proyecto nuevo

1. Alias de path, `src/styles/` con partials, `shared/` con componentes base (chart, pagination, form-utils), interceptor de auth y `environments/`.
2. Copiar solo las plantillas necesarias; no inventar estructura distinta.

## Aprobación previa y conflictos (confirmado por Marcos)

**Detenerse y pedir aprobación explícita antes de:**
- borrar datos o archivos;
- instalar o actualizar dependencias;
- cambios de contrato con los datos que otros consumen (interfaces de API, permisos, estados).

Explicar qué se hará, el impacto y a quién afecta, y esperar el sí. Commits, push y despliegues solo cuando Marcos los pida.

**Si la convención de esta skill y el código consolidado de una feature discrepan: preguntar a Marcos cada vez.** Describir la discrepancia (qué dice la skill, qué hace el código, qué opción recomiendo) y no decidir solo ni reescribir lo existente por iniciativa propia.

## Verificar antes de entregar

Ejecutar compilación, lint y las pruebas existentes con los scripts del repo. **Por defecto una tarea incluye pruebas unitarias de la lógica nueva y pruebas e2e del flujo afectado**, con el runner que ya tenga el repo (si no hay, el más moderno de la versión, previa aprobación). Comprobar la ruta real y las variantes afectadas (permisos, estados de error, móvil). Al entregar decir: qué cambió, el motivo técnico, qué se reutilizó y qué comprobaciones se ejecutaron (y cuáles no se pudieron ejecutar).

## Cómo evoluciona esta skill

Es un documento vivo. Cuando Marcos corrija o apruebe un patrón, actualizar la guía correspondiente (no dejar la regla solo en la conversación). El [checklist](references/checklist.md) es la base de las futuras reglas de validación.
