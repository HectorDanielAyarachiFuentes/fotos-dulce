# Agent Directives & Operational Rules (Router Universal de Skills)

> **REGLA DE ORO DE LECTURA EFICIENTE (Anti-Token Bloat):**
> **PROHIBIDO leer o escanear todos los archivos del espacio de trabajo de una sola vez.**
> Esta suite está organizada modularmente como un índice temático. Cuando recibas una tarea, **identifica qué necesitas y ve ÚNICAMENTE al directorio especializado correspondiente**.

---

## 🧭 Índice de Enrutamiento: "Si necesitas X, ve a Y"

| ¿Qué vas a hacer? | Carpeta Destino | Qué encontrarás / Qué usar |
| :--- | :--- | :--- |
| **Crear / Estilizar Frontend o Web** | `frontend_embellecedor/` | • `ui-pro-max/`: fondos Obsidian `#050508`, bordes beam cinéticos y cards spotlight.<br>• `impecable/`: grilla 8pt, escala modular, contraste AAA y micro-estados.<br>• `skill-ul/`: listas `<ul>` interactivas, barras con shimmer y widget de radar.<br>• Mira `frontend_embellecedor/index.html` para la integración viva. |
| **Limpiar código / Reducir complejidad / Evitar bloat** | `ponytail/` | • Reglas anti-bloat y escalera de 7 peldaños (reusar antes de codear).<br>• Consulta `ponytail/AGENTS.md` o `ponytail/skills/ponytail/SKILL.md`.<br>• Comandos sugeridos: `/ponytail-review`, `/ponytail-audit`. |
| **Workflow de ingeniería / Spec / Plan / TDD / Review** | `agent-skills/` | • 25 habilidades de Addy Osmani (`agent-skills/skills/`).<br>• Especificación atómica: `skills/spec-driven-development/`.<br>• Planificación por tareas: `skills/planning-and-task-breakdown/`.<br>• Pruebas rigurosas: `skills/test-driven-development/`. |
| **Lógica desde primeros principios / Modelos / Debugging** | `karpathy-skills/` | • `karpathy-skills/skills/karpathy-guidelines/SKILL.md`.<br>• Validar formas (shapes), tipos y datos paso a paso antes de añadir capas.<br>• Consulta ejemplos en `karpathy-skills/EXAMPLES.md`. |
| **Mapear dependencias / Análisis de impacto** | `.gitnexus/` & MCP GitNexus | • Usa `gitnexus_impact` y `gitnexus_context` para mapear el radio de impacto (*blast radius*) de una función antes de tocarla. |

---

## 1. Convenciones de Nomenclatura (Buenas Prácticas)
- **Cero espacios en rutas:** Usar siempre nombres en minúscula con guion bajo (`frontend_embellecedor/`) o guion medio (`agent-skills/`) para evitar saltos de escape en terminales (`\ `) y facilitar la navegación a cualquier agente o script.
- **Acceso atómico:** No cargar carpetas completas en contexto si solo se necesita un archivo o componente específico.

---

## 2. Safety & Hard Boundaries (Zona Prohibida - ECC Core)
- **Archivos protegidos:** Prohibido modificar o exponer `.env*`, `.git/`, tokens, credenciales y archivos de despliegue.
- **Inmutabilidad:** No alterar firmas de funciones existentes ni refactorizar código sin autorización explícita previa.
- **Operaciones terminal:** Prohibido ejecutar comandos destructivos (`rm -rf`, `git reset --hard`, `git push --force`).
- **Edición atómica:** Realizar cambios quirúrgicos únicamente en las líneas necesarias; no reescribir archivos completos innecesariamente.

---

## 3. OmniRoute Strategy (Optimización de Modelos y Costos)
- **Modelo Ligero (Fast / Haiku / Flash):** Aplicar para formateo, documentación (JSDoc), linting, commits y diffs rápidos.
- **Modelo Avanzado (Deep / Sonnet / Opus):** Aplicar para análisis arquitectónico, resolución de bugs lógicos y auditoría de dependencias.

---

## 4. Protocolo de Auditoría con GitNexus (Obligatorio)
Antes de proponer o aplicar cualquier cambio de código:
1. **Pre-Auditoría:** Invocar `gitnexus_impact` o `gitnexus_context` para mapear el radio de impacto (*blast radius*) de las funciones a tocar.
2. **Reporte:** Informar al usuario los archivos dependientes y el nivel de riesgo (Bajo / Medio / Alto).
3. **Ejecución:** Aplicar los cambios autorizados.
4. **Post-Auditoría:** Ejecutar `gitnexus_detect_changes` para certificar que no se introdujeron regresiones.

---

## 5. Directiva Frontend Embellecedor (Excelencia Visual Obligatoria)
Al generar, maquetar o modificar interfaces web en este espacio de trabajo o proyectos vinculados, es obligatorio aplicar la suite de `frontend_embellecedor/`:
- **Estructura y Contenedores (ui-pro-max):** Usar fondos oscuros profundos (Obsidian `#050508`), bordes cinéticos (`.pro-beam-card`), tarjetas spotlight con seguimiento de puntero (`.pro-spotlight-card`) y headers glassmorphism (`.pro-header-glass`).
- **Acabado, Espaciado y Botones (impecable):** Aplicar grilla geométrica 4pt/8pt (`--imp-space-*`), tipografía fluida balanceada con clamp, contraste WCAG AAA/AA verificado y micro-estados pulidos sin tosquedad (`.imp-btn`, `.imp-input`, tooltips).
- **Listas, Métricas y Stacks (skill-ul):** Usar listas estilizadas (`.skill-ul`), barras de progreso con animación shimmer continua (`.skill-bar-fill`), badges interactivos con brillo/destello (`.skill-badge-shine`) y widgets de radar Canvas.
- **Prohibido el diseño tosco o genérico:** No usar colores planos genéricos, layouts aburridos ni componentes sin micro-animaciones.


<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Vibecoding-Dulce** (70 symbols, 79 relationships, 0 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/Vibecoding-Dulce/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Vibecoding-Dulce/clusters` | All functional areas |
| `gitnexus://repo/Vibecoding-Dulce/processes` | All execution flows |
| `gitnexus://repo/Vibecoding-Dulce/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
