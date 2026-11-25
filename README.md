# Skills de desarrollo de Marcos

Dos skills independientes (se pueden instalar por separado):

| Skill | Alcance |
|---|---|
| `skills/dev-standard-frontend` | Frontend Angular (signals, Tailwind, ECharts), responsive, estilos centralizados |
| `skills/dev-standard-backend` | Backend NestJS (monolito modular o microservicios), contratos, datos, config |

Ambas comparten el flujo: plan con Superpowers `writing-plans`, construcción en ida y vuelta local y pruebas solo tras el OK de Marcos. Se adaptan a la versión real de cada proyecto.

## Instalación

Con la CLI de skills:

```
npx skills add https://github.com/MarkCarvajal/skill
```

Manual (GitHub Copilot / Claude Code): copiar la carpeta de la skill que quieras (`skills/dev-standard-frontend/` o `skills/dev-standard-backend/`) a una de estas rutas:

- Personal: `~/.copilot/skills/` o `~/.claude/skills/`
- Por proyecto: `.github/skills/` o `.claude/skills/`

Al activarse, cada skill muestra un banner como primera línea de la respuesta: `▰▰▰ ✦ Mark frontend skill ✦ ▰▰▰` o `▰▰▰ ✦ Mark backend skill ✦ ▰▰▰`.