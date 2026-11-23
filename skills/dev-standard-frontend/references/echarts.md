# Gráficos — Apache ECharts (siempre)

Cualquier gráfico (barras, líneas, pastel, mapas, gauge, heatmap, etc.) se hace con [Apache ECharts](https://echarts.apache.org/en/index.html). No usar otra librería de charts.

## Regla 0 aplicada a gráficos

1. Buscar si ya existe `shared/components/chart` (o equivalente). Si existe, **solo se pasa un `option`**.
2. Si no existe, crearlo una vez con la plantilla [templates/angular/chart.component.ts](../templates/angular/chart.component.ts) y reutilizarlo en todo el proyecto.
3. Nunca instanciar `echarts.init` dentro de una página o feature.

## Arquitectura

- **Un único componente** `app-chart` en `shared/components/chart/`:
  - `option = input.required<EChartsOption>()`, `height = input('320px')`, `loading = input(false)`.
  - Inicializa ECharts en `afterNextRender`, observa el contenedor con `ResizeObserver` (responsive real), actualiza con `setOption` en un `effect` cuando cambia `option`, y hace `dispose` al destruirse.
  - Importación modular (`echarts/core` + solo los charts/componentes usados) para no inflar el bundle; el registro de módulos vive en **un** archivo `shared/utils/echarts-setup.ts`.
- **Tema único** en `shared/utils/echarts-theme.ts`, alimentado por los tokens de color/fuente (ver [styles-responsive.md](styles-responsive.md)); registrado una vez con `echarts.registerTheme`. Los gráficos no definen colores propios.
- **Constructores de opciones** por tipo de gráfico en `shared/utils/chart-options/` (`buildBarOption`, `buildLineOption`, `buildPieOption`…) que reciben datos ya mapeados y devuelven `EChartsOption`. Las páginas llaman al constructor y pasan el resultado a `app-chart`; así el estilo del gráfico se centraliza y se cambia en un solo lugar.
- Los datos llegan mapeados (mapper de la feature) y el `option` se deriva con `computed` a partir del `resource`/signal de datos.

## Responsive en gráficos

- El contenedor es fluido (`w-full`); la altura escala por breakpoint (p. ej. `h-64 md:h-80 lg:h-96`) pasando la clase/alto al componente.
- En móvil: leyenda abajo y horizontal, `grid` con márgenes pequeños (`containLabel: true`), etiquetas de eje rotadas o abreviadas, `tooltip.confine: true`, menos ticks. Usar la opción `media` de ECharts (o un `computed` con el breakpoint) en el constructor de opciones, **no** en cada página.
- Validar cada gráfico a 360px antes de entregar.

## Buenas prácticas

- Estados de carga/vacío/error con los del resource (`loading` del componente + mensaje de "sin datos").
- Accesibilidad: `aria-label` en el contenedor y `title` descriptivo en el `option`.
- Gráficos pesados: `renderer: 'canvas'` por defecto; `svg` solo si se necesita nitidez/impresión.
