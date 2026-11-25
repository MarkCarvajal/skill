# Flujo de un entregable (MVP)

"MVP" aquí es **cualquier entregable**: una pantalla, una feature, una app. El flujo es siempre el mismo y tiene tres fases con una compuerta de aprobación de Marcos entre cada una.

```
1. Planificar (plan + maqueta)  →  [OK de Marcos]
2. Construir y afinar en local  →  [OK de Marcos: "el MVP está listo"]
3. Pruebas (unitarias + e2e)    →  entrega
```

## Fase 1 — Planificar

### 1.1 Plan con Superpowers `writing-plans` (siempre)

Todo entregable se planifica con la skill **`writing-plans` del plugin Superpowers**. No se improvisa un plan aparte.

- Antes del plan, si la idea aún no está aterrizada, usar `brainstorming` del mismo plugin para fijar alcance y supuestos.
- El plan se ajusta a lo más preciso: pasos pequeños y verificables, archivos concretos que se tocan, qué se reutiliza (Regla 0) y qué se crea, en la estructura `features/`, `core/`, `shared/` de esta skill.
- El plan incluye **un paso de maqueta aprobada** antes de cualquier paso de código (ver 1.2).
- El plan **no** incluye tareas de pruebas por cada paso; las pruebas van en la fase 3, tras el OK de Marcos.
- Si Superpowers no está disponible en el entorno (p. ej. no instalado o no soportado por la herramienta), no sustituirlo en silencio: decirlo, proponer instalarlo (ver [setup/INSTALAR.md](../setup/INSTALAR.md)) y, solo si Marcos lo acepta, redactar el plan con la misma estructura.

### 1.2 Maqueta con Claude Design (antes de codificar)

Las pantallas se elaboran **primero** en Claude Design, con Marcos iterando sobre ellas, y solo se codifica cuando la maqueta está aprobada.

1. Proponer las pantallas y estados necesarios (vacío, carga, error, móvil y escritorio) y elaborarlas en Claude Design.
2. Iterar con Marcos hasta que apruebe. Sin aprobación explícita de la maqueta no se escribe código de UI.
3. Codificar **sobre la maqueta aprobada**: es la referencia visual. Colores, fuentes y espaciados se llevan a los tokens de `src/styles/` (nada de valores sueltos) y cada pieza repetida se reutiliza o se centraliza (Regla 0).
4. Si el entorno no tiene acceso a Claude Design, pedir a Marcos la maqueta o su exportación; no inventar el diseño.
5. Si durante la construcción hace falta cambiar una pantalla, volver a la maqueta, actualizarla y obtener el OK.

## Fase 2 — Construir y afinar en local (ida y vuelta)

El objetivo es llegar rápido a algo que Marcos pueda ver y corregir.

1. Implementar el plan paso a paso, siguiendo la maqueta aprobada y esta skill.
2. **Mínimo técnico antes de mostrar:** que compile y que se pueda ver en local. Nada más.
3. **Mostrar el resultado** (la URL local, y la vista móvil y de escritorio) y esperar las correcciones de Marcos.
4. Aplicar las correcciones y volver a mostrar. Repetir.
5. **No se generan pruebas unitarias ni e2e durante esta fase.** Es un gasto de tiempo y esfuerzo que se rehace en cada iteración.

La fase termina solo cuando Marcos dice explícitamente que el MVP está listo ("ok, está listo", o equivalente). Sin ese OK no se pasa a pruebas.

## Fase 3 — Pruebas (solo tras el OK)

Con el OK de Marcos, se añaden las pruebas del entregable:

- **Unitarias** de la lógica nueva (servicios, utilidades, mappers).
- **e2e** del flujo principal, incluyendo la validación móvil: sin desborde horizontal a 360px y objetivos táctiles ≥ 44px (plantilla: [templates/angular/e2e-flow-and-mobile.spec.ts](../templates/angular/e2e-flow-and-mobile.spec.ts)).
- **Runner:** el que ya use el proyecto. Si no hay ninguno, el recomendado y compatible con la versión de Angular detectada (verificar en la documentación oficial de esa versión; ver [modernidad.md](modernidad.md)). No se fija un runner por defecto en esta skill. Instalar dependencias de prueba requiere aprobación.
- Ejecutar build, lint y las pruebas, y corregir lo que falle.

## Entrega

Decir: qué cambió, qué se reutilizó (`Reutilizado:` / `Nuevo (central):`), qué maqueta se siguió, y qué pruebas se ejecutaron (y cuáles no se pudieron ejecutar).
