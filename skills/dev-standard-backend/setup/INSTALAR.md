# Instalar dev-standard-backend y sus herramientas opcionales

La skill funciona sola. Las herramientas de abajo son opcionales y **solo las instala Marcos o el agente con su aprobación explícita** (son dependencias/configuración).

## 1. Instalar la skill

```
npx skills add https://github.com/MarkCarvajal/skill
```

Manual (GitHub Copilot / Claude Code): copiar `skills/dev-standard-backend/` a una de estas carpetas:

- Personal: `~/.copilot/skills/` o `~/.claude/skills/`
- Por proyecto: `.github/skills/` o `.claude/skills/`

Requisitos del equipo: Node.js LTS + npm.

## 2. Herramientas opcionales

| Herramienta | Qué aporta | Instalación |
|---|---|---|
| Superpowers (`writing-plans`, `brainstorming`) | Plan de cada MVP/entregable (obligatorio en el flujo) | Claude Code: plugin `superpowers`. Copilot CLI: `copilot plugin marketplace add obra/superpowers-marketplace` y `copilot plugin install superpowers@superpowers-marketplace` |

Los comandos vienen de la documentación oficial; verificar con `--help` o la doc vigente antes de ejecutar.

## 3. Protocolo del agente

1. Detectar si la herramienta ya está disponible.
2. Si falta y sería útil, **proponerla** (qué es, comando, alcance) y esperar el sí de Marcos.
3. Si no se instala, seguir sin ella y decirlo.
