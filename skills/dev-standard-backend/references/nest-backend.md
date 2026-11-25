# Nest — backend estándar

Aplica a monolito y a cada microservicio. Antes de crear algo: **Regla 0** (buscar en `common/`, `config/` y módulos vecinos).

## Arquitectura por defecto: monolito modular, backend-first

- Proyecto nuevo sin requisito real de servicios distribuidos → **monolito modular**. Un módulo por dominio (`AuthModule`, `UsersModule`, `CoursesModule`, `SubscriptionsModule`, `MediaModule`…), creando solo los que exige el alcance actual.
- Los microservicios (ver [nest-microservices.md](nest-microservices.md)) solo con evidencia: frontera estable y necesidad de desplegar, escalar u operar de forma independiente. Mantener contratos explícitos entre módulos para facilitar una extracción futura.
- Diseñar **desde el backend**: para cada operación identificar consumidor, entrada, salida, permisos, cambios persistidos y fallos esperados; revisar los contratos que ya consume el frontend u otros servicios antes de cambiarlos. Documentar la decisión si cambia un contrato, una frontera de módulo o el despliegue.
- **Cada dominio es dueño de sus reglas y escrituras.** Los demás módulos reutilizan sus operaciones exportando proveedores con una responsabilidad clara (nunca escriben en tablas ajenas). Una dependencia circular indica mala propiedad de la operación: rediseñar el contrato, no parchear con `forwardRef`.
- Módulos de composición (`PublicModule`, `PrivateModule`, `AdminModule`) solo si el proyecto los necesita: delegan en módulos de dominio y centralizan las políticas de acceso compartidas.
- HTTP y DTOs en el borde; reglas de negocio en servicios o casos de uso; Prisma en los puntos de persistencia que ya use el repo. Añadir una capa solo cuando resuelve una necesidad concreta.

## Estructura

```
src/
├─ main.ts
├─ app.module.ts
├─ config/            # envs.ts (Joi) + constants (tokens de servicio) + index.ts
├─ common/            # dto/ (pagination), exceptions/, decorators/, helpers/ + index.ts
└─ <feature>/
   ├─ dto/            # create-x.dto.ts, update-x.dto.ts, index.ts
   ├─ entities/       # solo con TypeORM (con Prisma el modelo vive en schema.prisma)
   ├─ interfaces/ · enums/ · decorators/ · guards/   # solo si hacen falta
   ├─ x.controller.ts
   ├─ x.service.ts
   └─ x.module.ts
```

Una feature = una carpeta = un módulo. Lo transversal va a `common/`, nunca se copia entre features.

## Config tipada (único acceso a variables de entorno)

- Todo `process.env` se lee **solo** en `config/envs.ts`, validado con Joi, exportado como objeto `envs`. El resto del código importa `envs` (`import { envs } from 'src/config'`).
- Siempre `.env.template` con todas las claves y valores de ejemplo (nunca reales). `.env` fuera de git.
- Plantilla: [templates/nest/envs.ts](../templates/nest/envs.ts).
- Nombres de tokens/servicios en `config/services.ts` (`NATS_SERVICE`), nunca strings sueltos.

## Bootstrap (main.ts)

```ts
const app = await NestFactory.create(AppModule);
app.setGlobalPrefix('api');
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
await app.listen(envs.port);
logger.log(`App running on port ${envs.port}`);
```

`Logger` con nombre. Sin `console.log`. Swagger (`@nestjs/swagger`) solo en el monolito HTTP/público.

## DTOs

- `class-validator` + `class-transformer`; `@Type(() => Number)` en query params.
- `Update` = `PartialType(Create)`. Reutilizar DTOs compartidos (`PaginationDto` vive en `common/`).
- Enums y listas de valores en `enums/`, con mensaje de validación claro.
- Exportar todo por `dto/index.ts`.

## Paginación (único estándar)

`PaginationDto { page = 1, limit = 10 }` y respuesta `{ data, meta: { total, page, lastPage } }`. Plantilla: [templates/nest/pagination.dto.ts](../templates/nest/pagination.dto.ts). No inventar `offset` por proyecto.

## Servicios y datos

- **Prisma por defecto** (cliente inyectable `PrismaService` extendiendo `PrismaClient`, `OnModuleInit`). TypeORM solo si el proyecto ya lo usa.
- Soft delete con campo `available`/`isActive` + `@@index`; las consultas filtran por él. Hard delete solo si se pide.
- `findOne` lanza `NotFoundException` (HTTP) o `RpcException` (microservicio) con mensaje `"<Entidad> with id #<id> not found"`. Update/remove llaman primero a `findOne` (no duplicar la consulta).
- Transacciones (`$transaction` / `QueryRunner`) cuando se tocan varias tablas.
- Errores de BD se traducen en **un** método central (`handleDBExceptions`) o un filtro; no `try/catch` repetidos por método.
- Nunca devolver `password` ni campos sensibles: `select: false` o desestructurar.

## Persistencia y cambios de esquema (Prisma + PostgreSQL)

- Alinear esquema, migración y cliente generado con la versión y scripts del repo. Al cambiar el esquema considerar datos existentes, claves únicas, concurrencia y transacciones para escrituras relacionadas.
- Planificar compatibilidad con despliegues escalonados (cambios aditivos primero, retirar después).
- Fallos de Prisma en build/despliegue: verificar el orden instalación → `prisma generate` → compilación → arranque.
- Respetar el gestor y lockfile del repo al tocar build o despliegue.

## Eventos repetibles: webhooks, pagos, colas

Definir la **identidad de la operación** (idempotency key / id del evento) y el comportamiento ante reintentos. Separar la persistencia transaccional de los efectos en proveedores externos y registrar los fallos recuperables con el patrón existente. Nunca confiar en que un webhook llegue una sola vez.

## Estados, transiciones y configuración de producto

- Modelar el negocio como **estados y transiciones explícitos**: para cada flujo definir acceso, estados, timeouts, efectos al cerrar y comportamiento al reconectar. Cada transición documenta sus efectos.
- Separar **qué cambia por configuración de producto** (timeouts, límites, flags con defaults editables, guardados en un módulo de ajustes) de **qué requiere cambio de contrato y revisión de negocio** (estados, permisos, efectos).
- Notificaciones (correo, push) bajo un único módulo de dominio, no dispersas por feature.

## Auth

- Monolito: Passport JWT, decorator compuesto `@Auth(...roles)` (aplica `RoleProtected` + guards), `@GetUser()`.
- Microservicios: ver [nest-microservices.md](nest-microservices.md).
- Passwords con `bcrypt`; el JWT firma solo lo necesario.
- Separar **autenticación**, **autorización** y comprobación de **acceso al recurso**: esta última se hace dentro del flujo de la operación. El backend es la autoridad de acceso; el frontend solo refleja.
- Formatos de respuesta, códigos y semántica de errores deben ser coherentes con los consumidores existentes.

## Calidad

- Una responsabilidad por método; controllers delgados (solo delegan), la lógica en services.
- Tipado estricto; sin `any` salvo en el borde de errores.
- Pruebas unitarias de la lógica de servicio y e2e de endpoints críticos, **solo después del OK de Marcos al MVP** (ver [flujo-mvp.md](flujo-mvp.md)); con el runner del proyecto o, si no hay, el compatible con la versión de Nest detectada.
