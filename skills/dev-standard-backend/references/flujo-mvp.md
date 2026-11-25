# Flujo de un entregable (MVP)

"MVP" aquí es **cualquier entregable**: un endpoint, un módulo, un servicio, una integración. El flujo es siempre el mismo y tiene tres fases con una compuerta de aprobación de Marcos entre cada una.

```
1. Planificar (plan + contrato)  →  [OK de Marcos]
2. Construir y afinar en local   →  [OK de Marcos: "el MVP está listo"]
3. Pruebas (unitarias + e2e)     →  entrega
```

## Fase 1 — Planificar

### 1.1 Plan con Superpowers `writing-plans` (siempre)

Todo entregable se planifica con la skill **`writing-plans` del plugin Superpowers**. No se improvisa un plan aparte.

- Antes del plan, si la idea aún no está aterrizada, usar `brainstorming` del mismo plugin para fijar alcance y supuestos.
- El plan se ajusta a lo más preciso: pasos pequeños y verificables, archivos concretos que se tocan, qué se reutiliza (Regla 0) y qué se crea, en la estructura de módulos de esta skill.
- El plan incluye **un paso de contrato aprobado** antes de cualquier paso de código (ver 1.2).
- El plan **no** incluye tareas de pruebas por cada paso; las pruebas van en la fase 3, tras el OK de Marcos.
- Si Superpowers no está disponible en el entorno, no sustituirlo en silencio: decirlo, proponer instalarlo (ver [setup/INSTALAR.md](../setup/INSTALAR.md)) y, solo si Marcos lo acepta, redactar el plan con la misma estructura.

### 1.2 Contrato propuesto (antes de codificar)

En backend la "maqueta" es el contrato. Antes de escribir código, proponer a Marcos:

- endpoints (método, ruta), entrada (DTO) y salida (forma de la respuesta);
- permisos y quién consume cada operación;
- estados de error esperados y sus códigos;
- cambios persistidos (tablas/campos) y si requieren migración (requiere aprobación aparte).

Sin aprobación del contrato no se escribe código. Si durante la construcción hay que cambiarlo, volver al contrato, actualizarlo y obtener el OK.

## Fase 2 — Construir y afinar en local (ida y vuelta)

1. Implementar el plan paso a paso, siguiendo el contrato aprobado y esta skill.
2. **Mínimo técnico antes de mostrar:** que compile y que el endpoint se pueda llamar en local. Nada más.
3. **Mostrar el resultado** (peticiones y respuestas reales de ejemplo) y esperar las correcciones de Marcos.
4. Aplicar las correcciones y volver a mostrar. Repetir.
5. **No se generan pruebas unitarias ni e2e durante esta fase.**

La fase termina solo cuando Marcos dice explícitamente que el MVP está listo. Sin ese OK no se pasa a pruebas.

## Fase 3 — Pruebas (solo tras el OK)

- **Unitarias** de la lógica de servicio nueva.
- **e2e** de los endpoints afectados: caso feliz, permisos y estados de error.
- **Runner:** el que ya use el proyecto. Si no hay ninguno, el recomendado y compatible con la versión de Nest detectada (verificar en la documentación oficial de esa versión; ver [modernidad.md](modernidad.md)). No se fija un runner en esta skill. Instalar dependencias de prueba requiere aprobación.
- Ejecutar build, lint y las pruebas, y corregir lo que falle.

## Entrega

Decir: qué cambió, qué se reutilizó (`Reutilizado:` / `Nuevo (central):`), qué contrato se siguió, y qué pruebas se ejecutaron (y cuáles no se pudieron ejecutar).
