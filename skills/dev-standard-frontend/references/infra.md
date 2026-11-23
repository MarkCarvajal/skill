# Entorno del frontend: variables, scripts, git y paquetes

## Variables y secretos

- **Nunca** credenciales, tokens ni cadenas reales en el código, en README ni en commits. Un frontend no guarda secretos: todo lo que va al bundle es público.
- URLs y flags por entorno en `environments/` (o la configuración equivalente de la versión).
- Si se detecta un secreto expuesto en un repo existente, avisar a Marcos para rotarlo.

## Scripts npm (nombres estándar)

`start` (puerto fijo), `build`, `lint`, `format`, `test`, `e2e`.

## Git

- `.gitignore` con `node_modules`, `dist`, `.env`, logs.
- **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`) en commits pequeños y descriptivos; ramas `feat/…`, `fix/…`, `chore/…`. Commits y push solo cuando Marcos lo pida. No versionar logs ni binarios generados.

## Gestor de paquetes

- Respetar el gestor que fija el repo (`packageManager`, lockfile). Si usa Yarn moderno, instalar con Corepack; no mezclar gestores.
- La versión de Node de un despliegue concreto no se generaliza a otros proyectos: fijar la del repo.
