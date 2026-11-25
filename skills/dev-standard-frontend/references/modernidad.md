# Modernidad y buenas prácticas (motor de actualización)

**Reparto de roles.** `dev-standard` define la **estructura**: dónde vive cada cosa, cómo se nombran los archivos, el orden de los miembros, la centralización y la Regla 0. Esta guía define el **motor de modernidad**: qué técnica, API o semántica actual usar *dentro* de esa estructura. La modernidad se adapta a la estructura de Marcos; nunca al revés.

Marcos está a favor de la evolución y de estar al día con lo que mejora rendimiento, accesibilidad y mantenimiento. Lo que la skill nombra (signals, `rxResource`, Reactive Forms…) son **ejemplos de base**, no una lista cerrada: usar eso o lo más moderno que lo reemplace en la versión del proyecto.

## 1. Orden de decisión

1. **Versión primero.** Detectar la versión real de cada pieza (Angular, Node, TypeScript, Tailwind, runner de tests, gestor de paquetes) leyendo `package.json`, lockfile y `angular.json`. No se asume ni se impone ninguna.
2. **Pack de herramientas de esa versión.** Elegir las APIs y prácticas recomendadas **para esa versión**. Si algo ya está deprecado en ella, no usarlo; si hay un reemplazo estable, usar el reemplazo.
3. **Lo existente manda en lo existente.** Formularios, tests, librería visual y demás: si el proyecto ya tiene una tecnología, se mantiene y se escribe con su forma moderna. Si no existe ninguna, se elige la más moderna y estable disponible para esa versión.
4. **La estructura de Marcos manda siempre.** Todo lo anterior se coloca en el orden estructural de la skill: features/core/shared, Regla 0, orden de miembros, estilos centralizados.

## 2. Jerarquía de fuentes

1. Patrón de Marcos y convenciones del repo (estructura, nombres, orden, centralización). No se negocia.
2. Guía oficial del framework **para la versión detectada** (angular.dev, Tailwind).
3. Plataforma web (CSS, HTML, APIs del navegador): guías de modernidad web, p. ej. `modern-web-guidance`.

Si una fuente de menor nivel contradice a una de mayor nivel, gana la de mayor nivel.

## 3. Herramientas opcionales

Son consejeras, no obligatorias. La skill funciona sin ellas y no se instalan sin aprobación de Marcos (dependencias/configuración).

- **Angular CLI MCP** (`ng mcp`): `get_best_practices`, `search_documentation`, `list_projects`, `run_target`, `onpush_zoneless_migration`. Si está disponible, consultar la guía de la versión detectada en lugar de la memoria. Verificar qué herramientas modifican el proyecto antes de usarlas, y preferir el modo de solo lectura.
- **Skills oficiales de Angular** (`angular-developer`, `angular-new-app`): `angular-new-app` solo genera la base; después se **reubica** en la estructura de Marcos.
- **modern-web-guidance**: buscar y recuperar guías de funciones de plataforma web (CSS/HTML/JS) cuando se escribe CSS, HTML o APIs del navegador.
- Si ninguna está disponible: usar la documentación oficial vigente (búsqueda web) y declarar que no se pudo contrastar con una herramienta.

## 4. Qué hacer con un hallazgo de modernidad

Cada mejora detectada se clasifica y se informa; **nunca se aplica en silencio** sobre código consolidado.

| Clase | Cuándo | Acción |
|---|---|---|
| **Adoptar** | Mejora compatible con la estructura y soportada por la versión | Usarla en código nuevo; en código existente, proponerla |
| **Adaptar y reubicar** | Sirve, pero su forma por defecto rompe la estructura | Tomar la técnica y colocarla en la ubicación y estilo de Marcos (p. ej. en `shared/`, con su orden de miembros). **Reubicar, no reprogramar** |
| **Descartar** | Choca con el patrón sin aportar rendimiento o seguridad | No usar y decirlo en una línea |
| **Preguntar** | Cambia un contrato, exige dependencia nueva o migración | Detenerse y pedir aprobación (ver SKILL.md) |

En código nuevo se aplica la técnica moderna directamente. En código existente, la modernización es una propuesta aparte, no un cambio colado dentro de otra tarea.

## 5. Decisiones ya tomadas por Marcos

- **Nombres de archivo:** mantener `nombre.component.ts`, `.service.ts`, etc. por claridad visual, **mientras no estén deprecados** o dejen de ser aceptados por el framework. Si el framework cambiara el valor por defecto, se sigue el esquema de Marcos y se avisa.
- **Formularios:** usar la API de formularios más moderna y estable de la versión del proyecto; mantener la centralización de validaciones y mensajes (`FormUtils` o su equivalente moderno). Si el proyecto ya usa una, se respeta.
- **Pruebas:** si hay runner, se usa el existente; si no hay ninguno, el más moderno soportado por esa versión. Sin fijar un runner en esta skill: el compatible con la versión detectada. Las unitarias y e2e se hacen tras el OK de Marcos al MVP (ver [flujo-mvp.md](flujo-mvp.md)).
- **Versiones:** sin mínimos fijos. Primero se valida la versión y luego se usa el pack de herramientas asociado.

## 6. Dónde se aplica cada tipo de mejora

- **Rendimiento:** `OnPush`, zoneless si la versión y el repo lo permiten, lazy loading, `@defer`, imágenes optimizadas, `track` en `@for`, sin suscripciones manuales.
- **Semántica y accesibilidad:** elementos HTML semánticos, `aria-*` solo cuando el elemento nativo no basta, foco visible, contraste, objetivos táctiles ≥ 44px.
- **CSS moderno:** preferir lo que la plataforma ya resuelve (container queries, `:has()`, `clamp()`, `min-width: 0`, variables), apoyándose siempre en los tokens de `src/styles/`; sin valores sueltos.
- **TypeScript:** tipado estricto, sin `any` injustificado.
- **Seguridad:** sin secretos en código, validación de entrada, sin `innerHTML` sin sanear.

## 7. Cómo reportar

En la entrega, una línea: `Modernidad: versión X detectada; adoptado A; adaptado B (reubicado en …); descartado C (motivo); sin contrastar con herramienta Y`.
