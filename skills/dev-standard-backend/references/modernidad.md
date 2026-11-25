# Modernidad y buenas prácticas (motor de actualización)

**Reparto de roles.** `dev-standard-backend` define la **estructura**: módulos por dominio, `common/`, `config/`, la Regla 0 y el orden de los miembros. Esta guía define el **motor de modernidad**: qué técnica o API actual usar *dentro* de esa estructura. La modernidad se adapta a la estructura de Marcos; nunca al revés.

Marcos está a favor de la evolución y de estar al día con lo que mejora rendimiento, seguridad y mantenimiento. Lo que la skill nombra (Joi, class-validator, Prisma, Passport) son **ejemplos de base**, no una lista cerrada: usar eso o lo más moderno que lo reemplace en la versión del proyecto.

## 1. Orden de decisión

1. **Versión primero.** Detectar la versión real de cada pieza (Nest, Node, TypeScript, Prisma u otro ORM, runner de tests, gestor de paquetes) leyendo `package.json` y el lockfile. No se asume ni se impone ninguna.
2. **Pack de herramientas de esa versión.** Elegir las APIs y prácticas recomendadas **para esa versión**. Si algo ya está deprecado en ella, no usarlo; si hay un reemplazo estable, usar el reemplazo.
3. **Lo existente manda en lo existente.** ORM, validación, auth, runner de pruebas: si el proyecto ya tiene una tecnología, se mantiene y se escribe con su forma moderna. Si no existe ninguna, se elige la más moderna y estable disponible para esa versión.
4. **La estructura de Marcos manda siempre.** Todo lo anterior se coloca en el orden estructural de la skill.

## 2. Jerarquía de fuentes

1. Patrón de Marcos y convenciones del repo (estructura, nombres, orden, centralización). No se negocia.
2. Documentación oficial del framework **para la versión detectada** (Nest, Prisma, Node).

Si una fuente de menor nivel contradice a una de mayor nivel, gana la de mayor nivel.

## 3. Qué hacer con un hallazgo de modernidad

Cada mejora detectada se clasifica y se informa; **nunca se aplica en silencio** sobre código consolidado.

| Clase | Cuándo | Acción |
|---|---|---|
| **Adoptar** | Mejora compatible con la estructura y soportada por la versión | Usarla en código nuevo; en código existente, proponerla |
| **Adaptar y reubicar** | Sirve, pero su forma por defecto rompe la estructura | Tomar la técnica y colocarla en la ubicación y estilo de Marcos. **Reubicar, no reprogramar** |
| **Descartar** | Choca con el patrón sin aportar rendimiento o seguridad | No usar y decirlo en una línea |
| **Preguntar** | Cambia un contrato, exige dependencia nueva o migración | Detenerse y pedir aprobación (ver SKILL.md) |

En código nuevo se aplica la técnica moderna directamente. En código existente, la modernización es una propuesta aparte, no un cambio colado dentro de otra tarea.

## 4. Decisiones ya tomadas por Marcos

- **Pruebas:** si hay runner, se usa el existente; si no hay ninguno, el compatible con la versión detectada. Las unitarias y e2e se hacen tras el OK de Marcos al MVP (ver [flujo-mvp.md](flujo-mvp.md)).
- **Versiones:** sin mínimos fijos. Primero se valida la versión y luego se usa el pack de herramientas asociado.

## 5. Dónde se aplica cada tipo de mejora

- **Rendimiento:** consultas con `select`/índices, paginación estándar, transacciones solo donde hacen falta, sin N+1.
- **Seguridad:** validación de entrada global, sin secretos en código, sin campos sensibles en respuestas, bcrypt/argon para contraseñas, expiración y firma mínima en JWT.
- **TypeScript/Nest:** tipado estricto, DTOs validados, sin `any` injustificado.
- **Operación:** configuración tipada y validada al arrancar, logs con `Logger` y nombre, errores traducidos en un único punto.

## 6. Cómo reportar

En la entrega, una línea: `Modernidad: versión X detectada; adoptado A; adaptado B (reubicado en …); descartado C (motivo)`.
