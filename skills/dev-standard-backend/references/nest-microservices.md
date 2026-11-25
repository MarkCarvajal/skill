# Nest — gateway + microservicios (NATS)

> **Úsalo solo con evidencia** de que existe una frontera estable que necesita despliegue, escalado u operación independiente. El punto de partida es el monolito modular de [nest-backend.md](nest-backend.md); no proponer microservicios por defecto.

Primero **Regla 0** y [nest-backend.md](nest-backend.md): todo lo allí dicho aplica a cada servicio.

## Topología

```
launcher/
├─ client-gateway/   # único punto HTTP; no tiene base de datos ni lógica de negocio
├─ <x>-ms/           # un microservicio por dominio, cada uno con su BD
├─ docker-compose.yml        # dev
└─ docker-compose.prod.yml   # prod
```

El gateway recibe HTTP, valida, y reenvía por NATS. Los ms solo hablan NATS.

## Transporte NATS (centralizado)

- Gateway y cada ms tienen `transports/nats.module.ts`. **Una sola** definición del `ClientsModule.register`; el `exports` re-exporta el mismo módulo (no repetir el objeto de configuración):

```ts
const natsClient = ClientsModule.register([
  { name: NATS_SERVICE, transport: Transport.NATS, options: { servers: envs.natsServers } },
]);

@Module({ imports: [natsClient], exports: [natsClient] })
export class NatsModule {}
```

- Los módulos de feature importan `NatsModule` e inyectan `@Inject(NATS_SERVICE) private readonly client: ClientProxy`.
- `main.ts` del ms: `NestFactory.createMicroservice<MicroserviceOptions>(AppModule, { transport: Transport.NATS, options: { servers: envs.natsServers } })` + el mismo `ValidationPipe`.

## Contratos de mensaje

- Patrón con formato `'<dominio>.<accion>.<entidad>'` (p. ej. `'auth.login.user'`, `'products.find.all'`). Un patrón por operación, definidos como constantes si se usan en 2+ sitios.
- Gateway: `this.client.send(pattern, payload)` y devuelve el observable (Nest lo resuelve). Usar `firstValueFrom` solo si hay que procesar el resultado.
- ms: `@MessagePattern(pattern)` + `@Payload()`. Los IDs se parsean con pipes (`ParseIntPipe`) en el ms.

## Errores

- En el ms: `throw new RpcException({ status, message })`.
- En el gateway: **un** filtro global `RpcCustomExceptionFilter` (plantilla: [templates/nest/rpc-exception.filter.ts](../templates/nest/rpc-exception.filter.ts)) que traduce `RpcException` a respuesta HTTP. No hay `catchError` repetido en cada controller; si el filtro cubre el caso, los controllers solo retornan `this.client.send(...)`.

## Auth distribuido

- `auth-ms`: `register`, `login`, `verify` (JWT, bcrypt). Es el único que conoce el secreto.
- Gateway: `AuthGuard` extrae el Bearer, llama `auth.verify.user` y deja `request.user`/`request.token`. Decorators `@User()` y `@Token()` en `auth/decorators/`. Rutas protegidas con `@UseGuards(AuthGuard)`.

## Datos por servicio

Cada ms es dueño de su BD; ningún ms lee la BD de otro. Validaciones cruzadas (p. ej. existencia de productos desde orders) se hacen por mensaje (`validate_products`), no por consulta directa.

## Docker / configuración

Ver [infra.md](infra.md). Las variables de cada servicio van en el compose por `${VAR}` desde un `.env` del launcher; nunca valores sensibles escritos en el compose.
