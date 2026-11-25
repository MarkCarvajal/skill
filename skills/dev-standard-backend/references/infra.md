# Infra del backend: Docker, entorno y secretos

## Variables y secretos

- **Nunca** credenciales, contraseñas, tokens ni cadenas de conexión reales en el código, en `docker-compose.yml`, en README ni en commits.
- Todo valor sensible va en `.env` (en `.gitignore`); el compose lo consume con `${VAR}`. Se versiona solo `.env.template` con valores de ejemplo.
- Cada servicio valida su entorno al arrancar (Joi en Nest). Si falta una variable, falla al iniciar con mensaje claro.
- Si se detecta un secreto expuesto en un repo existente, avisar a Marcos para rotarlo.

## Dockerfile

- `dockerfile` (dev): imagen `node:<versión del repo>-alpine`, `npm install`, copia el código, `prisma generate` si aplica; el compose monta `src` como volumen y corre `npm run start:dev`.
- `dockerfile.prod`: multi-stage (`deps` → `build` → `prod`) con la misma versión de Node que el repo, solo dependencias de producción, `USER node`, `CMD ["node","dist/main.js"]`. Las variables de BD correspondientes al **servicio** (no pegar la URL de otro).
- `.dockerignore` con `node_modules`, `dist`, `.env`, `.git`.

## docker-compose

- Un servicio por componente; `depends_on` para BD; NATS como `nats-server` único (solo si hay microservicios).
- Puertos y secretos por `${VAR}`. Un `docker-compose.yml` (dev) y un `docker-compose.prod.yml`; no duplicar bloques comunes si se puede usar `extends`/anclas YAML.

## Scripts npm (nombres estándar)

`start`, `start:dev`, `start:prod`, `build`, `lint`, `format`, `test`, `test:e2e`.

## Git

- `.gitignore` con `node_modules`, `dist`, `.env`, `generated/`, logs, `*.db` locales.
- **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`) en commits pequeños y descriptivos; ramas `feat/…`, `fix/…`, `chore/…`. Commits y push solo cuando Marcos lo pida. No versionar logs (`*.err.log`, `*.out.log`) ni binarios generados.

## Gestor de paquetes y despliegue (Render y similares)

- Respetar el gestor que fija el repo (`packageManager`, lockfile). Si el repo usa Yarn moderno, instalar con Corepack; no mezclar con pnpm/npm. Un `EROFS` al intentar retirar pnpm durante la instalación es síntoma de gestor mal elegido.
- Orden obligatorio con Prisma: **instalación → `prisma generate` → build → arranque**. Un `@prisma/client did not initialize` indica que falta `generate`.
- La versión de Node de un despliegue concreto no se generaliza a otros proyectos: fijar la del repo.
