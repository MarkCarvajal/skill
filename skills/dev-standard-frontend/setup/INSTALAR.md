# Instalar dev-standard-frontend y sus herramientas opcionales (otro PC / Mac)

La skill funciona sola. Las herramientas de abajo son opcionales y **solo las instala Marcos o el agente con su aprobación explícita** (son dependencias/configuración).

## 1. Llevar la skill a otro equipo

La skill es una carpeta: `~/.claude/skills/dev-standard-frontend/` (Windows: `C:\Users\<usuario>\.claude\skills\dev-standard-frontend\`).

Opción recomendada: repositorio git propio (privado).

```
cd ~/.claude/skills/dev-standard-frontend
git init && git add . && git commit -m "feat: skill dev-standard-frontend"
git remote add origin <tu-repo> && git push -u origin main
```

En el otro equipo:

```
git clone <tu-repo> ~/.claude/skills/dev-standard-frontend
```

Alternativa sin git: copiar la carpeta completa (zip, USB, nube). Para actualizar, volver a copiarla.

Requisitos del equipo: Node.js LTS + npm (para `npx`), Google Chrome (e2e con `channel: 'chrome'`).

## 2. Herramientas opcionales

Todas se ejecutan **en local** con `npx`; descargan paquetes la primera vez y no dependen de un servicio remoto propio para funcionar (salvo que una herramienta consulte documentación en línea; en ese caso hace falta internet).

| Herramienta | Qué aporta | Instalación | Alcance |
|---|---|---|---|
| modern-web-guidance | Guías de plataforma web (CSS/HTML/JS), búsqueda offline | `npx modern-web-guidance@latest install` | Por equipo/usuario |
| Angular CLI MCP | Buenas prácticas y docs de la versión del proyecto, `run_target`, `list_projects` | Registrar el servidor `npx -y @angular/cli mcp` en la configuración MCP de Claude Code del proyecto (`.mcp.json`), preferible `--read-only` | Por proyecto Angular |
| Superpowers (`writing-plans`, `brainstorming`) | Plan de cada MVP/entregable (obligatorio en el flujo) | Claude Code: plugin `superpowers`. Copilot CLI: `copilot plugin marketplace add obra/superpowers-marketplace` y `copilot plugin install superpowers@superpowers-marketplace` | Por equipo/usuario |`n| Skills oficiales de Angular (`angular-developer`, `angular-new-app`) | Guía de código y creación de apps Angular 20+ | `npx skills add https://github.com/angular/skills` | Por equipo/usuario |

Notas:
- Los comandos vienen de la documentación oficial; **verificar con `--help` o la doc vigente antes de ejecutar** (modern-web-guidance está en vista previa).
- El MCP de Angular necesita un proyecto Angular con su CLI instalado.
- Las skills de Angular apuntan a v20+; en proyectos anteriores, usarlas como consejo, no como regla.
- Orden de autoridad siempre el de `references/modernidad.md`: tu patrón > guía oficial de la versión > plataforma web.

## 3. Protocolo del agente

1. Detectar si la herramienta ya está disponible (skills listadas, servidor MCP configurado, `npx` accesible).
2. Si falta y sería útil, **proponerla** (qué es, comando, alcance) y esperar el sí de Marcos.
3. Si no se instala, seguir con la documentación oficial y declarar `sin contrastar con herramienta`.
