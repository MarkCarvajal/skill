# Validación futura, fallos típicos y puntos por confirmar

Base para las reglas de validación que Marcos definirá. **Ninguna comprobación se vuelve bloqueante** hasta confirmar que el repo ya aplica la regla o que Marcos la adoptó para ese proyecto.

## Automatizable vs revisión humana

| Automatizable | Revisión humana |
|---|---|
| Build, typecheck, lint y suites existentes con el gestor real del repo | Si la solución cumple casos de negocio que no están en las suites |
| Orden de miembros y formato (AST) una vez confirmados grupos, alfabetización y excepciones | Si una dependencia real justifica una excepción al orden o una refactorización |
| Límites de imports entre `core/`, `shared/` y `features/` cuando el árbol esté acordado | Propiedad de una regla, suficiencia de la extracción, reutilización semántica |
| Regresión de máscara: prefijo, valores iniciales, pegado, borrado | Comportamiento con teclado virtual real cuando depende de hardware, navegador o IME |
| Build, lint, tipos y pruebas de mappers/servicios | Que las interfaces de API coincidan con lo que la UI asume; impacto en consumidores |
| Pruebas de transiciones de estado, permisos y reintentos con contrato aprobado | Definición de estados, permisos, efectos externos y qué casos requieren idempotencia |

Candidatas a automatizar sin esperar: duplicación de lógica (búsqueda de símbolos/estilos repetidos), valores hardcodeados de colores/breakpoints fuera de `src/styles/`, `console.log` y código comentado, secretos en el repo.

## Fallos típicos del código generado por IA (orden de revisión por impacto)

1. Cambios de contratos, permisos o estados de negocio sin avisar a los consumidores.
2. Suposiciones de versión o gestor de paquetes que rompen build o despliegue.
3. Regresiones que dependen del dispositivo (teclado virtual, navegador).
4. Duplicación que dispersa una regla entre módulos.

(Es una prioridad de revisión, no una medición histórica.)

## Qué evidencia pedir al aprobar un cambio

- Cambio que solo falla en un dispositivo o proveedor externo: dispositivo y teclado exactos, pasos de reproducción, resultado antes/después.
- Cambio de contrato: quién lo consume y cómo se verificó desde su punto de entrada.

## Decisiones contextuales a conservar (no "corregir")

- El guard de un dashboard privado se acota a ese flujo y vive en su feature.
- Resolver específico para bloquear login en incógnito con el proveedor de identidad.
- Reglas de negocio de un producto (p. ej. live: reconexión solo en `INTERRUPTED` dentro del plazo, cierre por timeout sin publicación automática, una sesión activa por identidad y evento) pertenecen a ese producto, no al estándar.

## Pendiente de confirmar con Marcos (no asumir)

- Formato y lint: `.prettierrc`, `.editorconfig`, ESLint reales (las opciones de Prettier de la skill salen de sus repos de curso).
- Convenciones de nombres Angular (sufijos, selectores) y plantilla de PRs. (Resuelto: commits con Conventional Commits.)
- Plantilla de entrega. (Resuelto: aprobación previa para migraciones, borrados, dependencias y cambios de contrato.)
- Dónde se guarda el token y cómo se hace refresh; estrategia real de auth.
- Contrato HTTP estándar (envoltorio, paginación `page/limit` o cursor, errores).
- Cobertura mínima y runner preferido; `OnPush`, `@defer`, `track`. (Resuelto: unitarias + e2e del flujo, pero solo tras el OK de Marcos al MVP; runner según versión.)
- Tabla estándar (PrimeNG u otra) y paginación en URL.
- i18n, accesibilidad, SSR, modo oscuro; paleta, tipografías y breakpoints reales de sus proyectos.
- Repo de referencia o un commit/PR aprobado (antes/después) como muestra de código que sí aprobaría.
- (Resuelto: ante discrepancia entre skill y código de la feature, preguntar a Marcos cada vez.)
