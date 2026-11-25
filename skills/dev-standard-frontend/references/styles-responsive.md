# Estilos centralizados y responsive

**Responsive es obligatorio**: nada se entrega sin validar espaciados y tamaños en móvil.

## Carpeta `src/styles/` (única fuente de estilo)

Un archivo por tipo de elemento; `styles.scss` solo los importa.

```
src/styles/
├─ _breakpoints.scss   # breakpoints + mixins de media query (ÚNICA fuente de tamaños)
├─ _colors.scss        # paleta y colores semánticos
├─ _fonts.scss         # familias, tamaños, pesos, line-height
├─ _spacing.scss       # escala de espaciado y gutters por breakpoint
├─ _radius-shadows.scss# radios, sombras, z-index  (crear cuando se necesiten)
├─ _tokens.scss        # emite todo como CSS custom properties en :root
└─ styles.scss         # @use de todos + base global
```

- Se crea un partial nuevo **solo cuando aparece un tipo de elemento nuevo** (p. ej. `_charts.scss` para la paleta de ECharts, `_animations.scss`). Antes de crear: Regla 0.
- Plantillas listas: [templates/styles/](../templates/styles/).
- Los valores (colores, fuentes, tamaños, breakpoints) **se definen una vez** aquí. Prohibido hardcodear `#hex`, `px` de layout o `@media (min-width: …)` sueltos en componentes.

## Tailwind + SCSS

Tailwind v4 no procesa Sass, así que:

- `_tokens.scss` expone los valores como variables CSS (`--app-color-primary`, `--app-font-sans`, `--app-space-gutter`…; prefijo `--app-` para no chocar con las variables de Tailwind).
- Un `tailwind.css` (`@import "tailwindcss"; @theme inline { --color-primary: var(--app-color-primary); … }`) conecta Tailwind con esos tokens para usar `bg-primary`, `font-sans`, etc.
- Los breakpoints no pueden usar `var()` en media queries: la fuente de verdad es `_breakpoints.scss` y `@theme { --breakpoint-* }` **replica** esos valores. Cualquier cambio de breakpoint se hace en los dos y el [checklist](checklist.md) lo verifica.
- Preferir clases Tailwind en la plantilla; SCSS de componente solo para lo que Tailwind no cubra, usando los mixins/tokens.

## Mobile-first

- Estilos base = móvil; se amplía con `sm: md: lg: xl:` (`min-width`). Nunca diseñar escritorio primero y "arreglar" móvil.
- Breakpoints de referencia (editables en `_breakpoints.scss`): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Mixins: `@include up(md) { … }` / `@include down(md) { … }` en SCSS.

## Reglas de validación móvil (se aplican a todo componente/página)

1. Probar a **360px** y **375px** de ancho, además de tablet y escritorio. Sin scroll horizontal.
2. **Espaciados escalan**: gutters de página `16px` en móvil, más en `md+` (usar tokens de `_spacing.scss`); separaciones entre bloques con la escala, no con valores sueltos.
3. **Tamaños**: tipografía fluida o escalonada por breakpoint (título más pequeño en móvil); objetivos táctiles ≥ 44×44px; inputs ≥ 16px de fuente (evita zoom en iOS).
4. **Layouts**: columnas colapsan a 1 en móvil (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`); tablas con contenedor scrolleable o vista tarjeta; navegación colapsada en móvil.
5. **Imágenes y gráficos** fluidos (`w-full`, `max-w-full`, aspect-ratio); ECharts redimensiona con su contenedor (ver [echarts.md](echarts.md)).
6. Modales/drawers a ancho completo en móvil; sin elementos con ancho fijo en `px` mayor que el viewport.
7. Verificar con el navegador en modo móvil (herramienta de resize) antes de dar el trabajo por terminado y decirlo en la entrega.

## Colores y fuentes

- Colores semánticos (`primary`, `secondary`, `success`, `warning`, `danger`, `surface`, `text`, `muted`) apuntando a la paleta; los componentes usan nombres semánticos, nunca el valor.
- Soporte de modo oscuro cuando el proyecto lo requiera: redefinir tokens bajo `@media (prefers-color-scheme: dark)` / clase `.dark`, sin tocar componentes.
- Fuentes cargadas una vez (Google Fonts / local) y declaradas en `_fonts.scss`.

## Validar la modalidad de entrada, no solo el ancho

Un formulario puede funcionar a 360px con teclado físico y fallar con el teclado virtual (p. ej. el teclado numérico de Android bloqueaba un input con máscara tras dos caracteres). Al validar cambios en formularios:

- Probar con **teclado virtual real** (dispositivo físico o BrowserStack) además del resize del navegador, y contrastar con teclado físico.
- Si el fallo depende del dispositivo, registrar modelo, sistema, navegador y teclado, los pasos de reproducción y el resultado antes/después.
- Un cambio que solo se pudo probar en emulación debe decirlo explícitamente en la entrega.

## Lecciones de una prueba real (agenda, e2e a 360px)

- **Grids: columna `minmax(0,1fr)` en móvil.** Un grid sin ella crece hasta el ancho de la palabra más larga y desborda la página aunque el texto tenga `break-words`. Patrón: `grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[22rem_minmax(0,1fr)]`. En hijos flex que contienen texto: `min-w-0` + `break-words`.
- **Prueba e2e obligatoria de desborde y táctil** (se ejecuta en la fase de pruebas, tras el OK al MVP; durante la ida y vuelta local se revisa a ojo en móvil) (plantilla: [templates/angular/e2e-flow-and-mobile.spec.ts](../templates/angular/e2e-flow-and-mobile.spec.ts)): viewport 360×740, entrada con título de 80 caracteres sin espacios, `scrollWidth <= clientWidth`, y controles con `boundingBox().height >= 44`.
- **Tokens utilizables como utilidades Tailwind** (`px-gutter`, `min-h-touch`, `text-title`) se declaran en `@theme inline` de `tailwind.css` apuntando a `--app-*`. Los controles repetidos (`.field`, `.btn`) viven en `_forms.scss` y `_buttons.scss`, una sola vez.
