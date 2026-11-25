# Validación futura, fallos típicos y puntos por confirmar

Base para las reglas de validación que Marcos definirá. **Ninguna comprobación se vuelve bloqueante** hasta confirmar que el repo ya aplica la regla o que Marcos la adoptó para ese proyecto.

## Automatizable vs revisión humana

| Automatizable | Revisión humana |
|---|---|
| Build, typecheck, lint y suites existentes con el gestor real del repo | Si la solución cumple casos de negocio que no están en las suites |
| Orden de miembros y formato (AST) una vez confirmados grupos y alfabetización | Si una dependencia real justifica una excepción al orden o una refactorización |
| Esquema Prisma, `generate`, build y pruebas de contratos seleccionados | Compatibilidad de una migración con datos activos, impacto en consumidores, orden de lanzamiento |
| Pruebas de transiciones de estado, permisos y reintentos con contrato aprobado | Definición de estados, permisos, efectos externos y qué casos requieren idempotencia |

Candidatas a automatizar sin esperar: duplicación de lógica, `console.log` y código comentado, secretos en el repo.

## Fallos típicos del código generado por IA (orden de revisión por impacto)

1. Cambios de contratos, permisos o estados de negocio sin avisar a los consumidores.
2. Suposiciones de versión o gestor de paquetes que rompen build o despliegue.
3. Duplicación que dispersa una regla entre módulos.

(Es una prioridad de revisión, no una medición histórica.)

## Qué evidencia pedir al aprobar un cambio

- Cambio de contrato: quién lo consume y cómo se verificó desde su punto de entrada.
- Cambio que solo falla con un proveedor externo: pasos de reproducción, resultado antes/después.

## Decisiones contextuales a conservar (no "corregir")

- Monolito modular elegido tras explorar microservicios (TCP, NATS) en aprendizaje.
- Las reglas de negocio de un producto concreto pertenecen a ese producto, no al estándar.

## Pendiente de confirmar con Marcos (no asumir)

- Formato y lint: `.prettierrc`, `.editorconfig`, ESLint reales.
- Plantilla de PRs.
- Dónde se guarda el token y cómo se hace refresh; estrategia real de auth.
- Contrato HTTP estándar (envoltorio, paginación `page/limit` o cursor, errores).
- Cobertura mínima y runner preferido (hoy: el del proyecto o el compatible con la versión; unitarias + e2e solo tras el OK al MVP).
- Repo de referencia o un commit/PR aprobado (antes/después) como muestra de código que sí aprobaría.
