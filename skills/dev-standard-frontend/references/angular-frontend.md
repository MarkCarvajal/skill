# Angular — frontend estándar

Angular standalone, signals, rxjs, Tailwind, en las versiones que soporte el repo (detectarlas; ver Paso 1 de SKILL.md). Primero **Regla 0**: buscar en `shared/` y features vecinas antes de crear. Estilos y responsive en [styles-responsive.md](styles-responsive.md); gráficos en [echarts.md](echarts.md).

## Estructura: `features/`, `core/`, `shared/` (estructura acordada)

La **feature es la unidad predominante**; `pages/` es un directorio **dentro** de cada feature. Para apps nuevas y al aplicar la estructura acordada. Si el repo ya tiene otra organización, se respeta y se avisa (Paso 1 de SKILL.md).

```
src/
├─ environments/
├─ styles/                    # ver styles-responsive.md
└─ app/
   ├─ app.config.ts · app.routes.ts · app.component.ts
   ├─ core/                   # infraestructura transversal
   │  └─ interceptors/ · config/ · providers/ · services (auth base)
   ├─ shared/                 # reutilizable entre features y libre de reglas de una feature (Regla 0 vive aquí)
   │  ├─ components/ (chart, pagination, search-input, ...)
   │  └─ directives/ · pipes/ · services/ · utils/ · interfaces/
   └─ features/
      └─ <feature>/           # todo lo propio del flujo, junto
         ├─ <feature>.routes.ts  # export const + export default
         ├─ pages/               # componentes enrutados (vistas)
         ├─ layouts/ · components/
         ├─ services/ · guards/ · mappers/ · utils/
         └─ interfaces/          # modelo propio + respuesta de API por separado
```

- **Ubicar cada pieza según sus consumidores actuales.** Un guard exclusivo del dashboard privado vive junto a sus rutas dentro de su feature; lo que usan varias features sube a `shared/`; la infraestructura (interceptores, config, proveedores de aplicación) a `core/`.
- Las **pages** (componentes enrutados) son delgadas: orquestan servicios y pasan datos a componentes. La lógica va en servicios/utils.
- Un componente de `features/<feature>/components` usado por 2+ features **se sube a `shared/components`** (no se copia).
- Lazy loading en las fronteras de ruta cuando encaje con el proyecto.

## Archivos y alias

- `name.component.ts` + `name.component.html` (+ `.scss` solo si Tailwind no alcanza). Selector `app-…`.
- Alias en `tsconfig.json`: `@auth/*`, `@products/*`, `@shared/*`, `@environments/*`. Importar siempre por alias, no con `../../`.

## Componentes

```ts
@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  imageUrl = computed(() => ...);

  product = input.required<Product>();

  selected = output<Product>();

  private router = inject(Router);

  onSelect() {
    ...
  }
}
```

- Orden de miembros: signals → inputs → outputs → injects → métodos (ver SKILL.md). Alfabético dentro de cada grupo. Línea en blanco entre métodos.
- `input()`/`output()`/`model()`, `inject()`, `@if/@for/@switch` (con `track` por id, no `$index` si hay id), `@empty`.
- `OnPush` por defecto. Plantillas sin lógica pesada: usar `computed` o pipes.
- Booleanos de estado (`isLoading`, `hasError`) como signals; derivar con `computed`, no duplicar estado.

## Estado y datos

- Estado local/de feature = signals en el servicio o componente; `computed` para derivados; `effect` solo para efectos de borde (storage, navegación), nunca para derivar datos.
- Datos remotos: `rxResource`/`resource` en el componente con parámetros reactivos (`request` en Angular 19, `params` en 20+) a partir de querystring o id de ruta. Estados `isLoading()/error()/value()` desde el propio resource. Evitar `subscribe` manual; si es una mutación (login, guardar), `subscribe` en el handler con `next/error`.
- Estado de URL (página, filtro, query) vive en la URL: servicio/utilidad central (`PaginationService`) con `toSignal(queryParamMap)`. No repetir esta lógica por página.

## Servicios HTTP

- `@Injectable({ providedIn: 'root' })`, `private http = inject(HttpClient)`, URL desde `environment` (única fuente).
- Tipos de respuesta de API en `interfaces/<api>.interface.ts`; modelo de la app en `interfaces/<x>.interface.ts`; conversión en `mappers/<x>.mapper.ts` con métodos estáticos (`mapApiToX`, `mapApiArrayToXArray`).
- Caché simple con `Map` por clave dentro del servicio cuando la consulta es repetible. Si 2+ servicios necesitan caché, extraerla a un helper en `shared/utils`.
- Errores: `catchError` → `throwError` con mensaje de dominio, **una vez** en el servicio; los componentes solo leen `error()`.
- Sin `delay`, `tap(console.log)` ni datos de demo en el código final.

## Rutas

- Lazy por feature: `loadChildren: () => import('./x/x.routes')` (el archivo hace `export default`).
- Layout con `children`; wildcard `**` al final de cada feature (not-found o redirect).
- Guards funcionales (`CanMatchFn`/`CanActivateFn`) en `features/<feature>/guards/`. Lógica común de auth en `AuthService`, no en cada guard.

## Auth

- `AuthService` con signals privados (`_user`, `_token`, `_authStatus`) y `computed` públicos (`user`, `token`, `isAdmin`, `authStatus`); `checkStatusResource = rxResource(...)`.
- Interceptor funcional: solo añade `Authorization` si hay token (nunca `Bearer null`). Registrado en `provideHttpClient(withInterceptors([...]), withFetch())`.

## Formularios

- Reactive Forms con `FormBuilder` (`inject(FormBuilder)`), tipados, como base observada; si la versión del proyecto ofrece una API de formularios más moderna y estable, usar esa (ver [modernidad.md](modernidad.md)) manteniendo la centralización de validaciones y mensajes.
- Validaciones, patrones y **mensajes de error centralizados** en `shared/utils/form-utils.ts` (`FormUtils`): `isValidField`, `getFieldError`, validadores cruzados. Plantilla: [templates/angular/form-utils.ts](../templates/angular/form-utils.ts). Nunca escribir un mensaje de error directo en una página.
- Un componente de campo reutilizable (`shared/components/form-field`) cuando 2+ formularios repiten el bloque label + input + error.

## UI

- Tailwind (utility-first) con tokens del proyecto (ver estilos). Componentes UI base (botón, card, modal, tabla, paginación, input) viven en `shared/components` y se reutilizan; no se re-estiliza lo mismo en cada página.
- Todo componente se revisa en móvil (ver [styles-responsive.md](styles-responsive.md)).

## Estados de la UI y teclado

Todo flujo afectado cubre **carga, error, vacío** y navegación con teclado (foco visible, orden de tabulación, Enter/Escape en formularios y modales). Se derivan del resource (`isLoading()`, `error()`, `value()`), no con banderas duplicadas.

## Conservar el stack visual

Si el repo usa PrimeNG, Tailwind y SCSS (u otra librería), se reutilizan sus componentes, estilos y tokens y se respetan sus versiones; no se introduce una librería de UI paralela. Los wrappers compartidos (`shared/components`) envuelven el componente de la librería para centralizar su configuración.

## Formularios con máscara

Distinguir tres cosas: **formato visual**, **valor del formulario** y **payload** enviado. Verificar escritura, borrado, pegado, valores iniciales y validación, con y sin máscara/prefijo. Si el fallo depende del dispositivo, reproducir con el teclado virtual relevante y registrar navegador, sistema y modelo. La máscara se implementa una vez (directiva o componente en `shared/`).

## Autenticación en el frontend

Separar autenticación, autorización y navegación; guard, resolver e interceptor según su responsabilidad. Respetar el flujo del proveedor de identidad. El backend es la autoridad de acceso: el frontend solo oculta/redirige.

## Estado compartido

Signals para estado local síncrono y `computed` para derivaciones; RxJS donde ya modela HTTP, cancelación o flujos asíncronos, acotando la interoperabilidad (`toSignal`/`toObservable`) al límite que la necesita. Un almacén compartido solo cuando hay varios consumidores y un ciclo de vida que lo justifiquen.

## Migración de Angular legacy

Desde NgModules (p. ej. Angular 14): avanzar por **versiones mayores** y por **features**, verificando en cada paso rutas, dependencias y alcance de proveedores; conservar puntos de entrada y comportamiento visible. Standalone para código nuevo donde el repo lo soporte.

## Microfrontends

Evaluarlos solo cuando el objetivo sea desarrollar y desplegar dominios de forma independiente. Antes: definir equipos, rutas y contratos de integración (público, privado, auth, commerce según corresponda). Justificar un shell solo si tiene responsabilidades concretas de composición o navegación.

## Stack visual observado en sus proyectos (el repo manda)

Marcos ha usado PrimeNG (tema Lara Light Blue + PrimeIcons), Tailwind v4.1 con SCSS (`@tailwindcss/postcss`), DaisyUI, `ngx-mask` y Angular Material (DataSource + paginador). Es evidencia de uso, **no** una lista obligatoria: en cada repo se usa lo que ya tiene. Al instalar dependencias, vigilar compatibilidad de versiones (p. ej. conflictos `ERESOLVE` con PrimeNG 19).

## Directivas de input con máscara (patrón confirmado)

- Se configuran con `input()` (prefijo, uso con/sin máscara, requerido) y el prefijo inicial se aplica al inicializar.
- Valor visible ≠ valor del control: el control guarda el valor limpio; el payload se arma aparte.
- Una sola directiva reutilizable (Regla 0): antes de crear otra, buscar la existente y extenderla.
- Validar escritura, borrado, pegado, valores iniciales y la variante sin máscara, y **con teclado virtual real** (ver [styles-responsive.md](styles-responsive.md)).

## Controles previos al flujo de login

Cuando el proveedor de identidad impone condiciones del navegador (p. ej. PingOne DaVinci depende de cookies de terceros y no funciona en incógnito), se resuelve con un **resolver específico** que bloquea el inicio del flujo y muestra el motivo, no con lógica dispersa en componentes. El guard se coloca según el flujo que realmente protege (p. ej. solo el dashboard privado), dentro de su feature.

## Notas de tooling

- El runner de pruebas unitarias es el que use el proyecto o, si no hay, el recomendado y compatible con la versión de Angular detectada; no se fija uno en esta skill. Si el repo ya tiene uno, se respetan sus dependencias y configuración existentes (no se migra por iniciativa propia).
- E2E con Playwright: usar `channel: 'chrome'` en `playwright.config.ts` para aprovechar el Chrome instalado y evitar descargar navegadores (plantilla: [templates/angular/playwright.config.ts](../templates/angular/playwright.config.ts)). Si un runner basado en navegador no detecta Chrome, apuntar `CHROME_BIN` al ejecutable instalado.
- Persistencia en `localStorage`: siempre detrás de un `LocalStorageService` central (try/catch, valor por defecto) y un único método privado `commit()` en el servicio de la feature; validar la forma de los datos leídos (`Array.isArray`). Plantilla de campo de formulario reutilizable: [templates/angular/form-field.component.ts](../templates/angular/form-field.component.ts).
- Tipar explícitamente genéricos con `null` en los specs (`get<Foo | null>(k, null)`), o TypeScript infiere `null`.
