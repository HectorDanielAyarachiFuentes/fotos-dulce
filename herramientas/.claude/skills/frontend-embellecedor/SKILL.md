---
name: frontend-embellecedor
description: "Directiva y guía completa para embellecer interfaces y páginas web con la suite de 3 pilares: UI Pro Max (alto contraste, obsidian, bordes dinámicos, glassmorphism), Impeccable (precisión matemática 8pt, contraste verificado AAA, estados pulidos) y Skill-UL (listas interactivas, barras fluidas, badges con brillo, widgets de radar). Usar siempre al crear o estilizar interfaces web."
---

# Frontend Embellecedor — Protocolo de Excelencia Visual

Esta habilidad instruye a los agentes a crear interfaces web premium, modernas y pulidas utilizando la suite ubicada en `Fronted embellecedor/`.

## Los 3 Pilares y su Función

| Pilar | Directorio | Función en la Interfaz | Clases y Tokens Clave |
| :--- | :--- | :--- | :--- |
| **UI Pro Max** | `Fronted embellecedor/ui-pro-max/` | Contenedores principales, tarjetas spotlight, bordes dinámicos tipo beam, glassmorphism y paleta obsidian. | `.pro-beam-card`, `.pro-spotlight-card`, `.pro-header-glass`, `.pro-badge`, `--pro-bg-deep` |
| **Impeccable UI** | `Fronted embellecedor/impecable/` | Espaciado matemático (4pt/8pt grid), escala modular de tipografía, contraste verificado WCAG AAA y micro-estados en botones e inputs. | `.imp-btn`, `.imp-input`, `data-tooltip`, `--imp-space-*`, `--imp-font-*`, `--imp-ease-out` |
| **Skill-UL** | `Fronted embellecedor/skill-ul/` | Listas estilizadas `<ul>`, barras de progreso con animación shimmer, badges flotantes con destello y widget de radar interactivo. | `.skill-ul`, `.skill-bar-fill`, `.skill-badge-shine`, `.skill-collapsible`, `createSkillRadar()` |

---

## Regla de Oro: Síntesis de Aplicación

Cuando se diseñe, modifique o maquete cualquier componente o página web:
1. **Contenedor y tarjetas base:** Aplicar la estructura visual de alto contraste y bordes de `ui-pro-max`.
2. **Detalles de acabado, botones y transiciones:** Aplicar las reglas de espaciado matemático y micro-estados de `impecable`.
3. **Secciones de características, stacks, métricas o listados:** Implementar los componentes interactivos de `skill-ul`.

---

## Snippets de Integración Rápida

### 1. Inclusión de Estilos y Módulos
```html
<link rel="stylesheet" href="./Fronted embellecedor/ui-pro-max/styles/ui-pro-max.css">
<link rel="stylesheet" href="./Fronted embellecedor/impecable/styles/impeccable.css">
<link rel="stylesheet" href="./Fronted embellecedor/impecable/styles/buttons.css">
<link rel="stylesheet" href="./Fronted embellecedor/skill-ul/styles/skill-ul.css">

<script type="module" src="./Fronted embellecedor/ui-pro-max/components/spotlight-card.js"></script>
<script type="module" src="./Fronted embellecedor/ui-pro-max/components/translucent-header.js"></script>
<script type="module" src="./Fronted embellecedor/impecable/components/tooltip.js"></script>
<script type="module" src="./Fronted embellecedor/skill-ul/components/skill-bars.js"></script>
```

### 2. Header Translúcido con Glassmorphism
```html
<header class="pro-header-glass">
  <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px 24px; max-width: 1200px; margin: 0 auto;">
    <div style="font-weight: 800; font-size: 1.2rem; color: #fff;">Mi Proyecto</div>
    <button class="imp-btn imp-btn-primary" data-tooltip="Comenzar ahora">Iniciar</button>
  </div>
</header>
```

### 3. Tarjeta con Borde Beam Cinético
```html
<div class="pro-beam-card">
  <div class="pro-beam-content">
    <span class="pro-badge glow-cyan"><span class="pro-pulse-dot"></span> Característica Pro</span>
    <h3 style="color:#fff; margin-top: 12px;">Título de Alta Gama</h3>
    <p style="color: var(--imp-text-secondary); font-size: var(--imp-font-sm);">Descripción matemáticamente espaciada.</p>
  </div>
</div>
```

### 4. Tarjeta Spotlight con Seguimiento de Cursor
```html
<div class="pro-spotlight-card">
  <h4 style="color:#fff; margin:0 0 8px;">Tarjeta Interactiva</h4>
  <p style="color: var(--imp-text-secondary); margin:0;">El reflejo sigue al puntero con un resplandor dinámico.</p>
</div>
```

### 5. Badges con Destello y Barras de Progreso Animadas
```html
<!-- Badge con Destello en Hover -->
<span class="skill-badge-shine skill-badge-floating">
  <span style="color: #06b6d4;">✦</span> TypeScript
</span>

<!-- Barra de Progreso con Shimmer -->
<div class="skill-bar-group">
  <div class="skill-bar-wrapper">
    <div class="skill-bar-header">
      <span>Capacidad</span>
      <span class="skill-bar-percent">0%</span>
    </div>
    <div class="skill-bar-track">
      <div class="skill-bar-fill" data-value="92"></div>
    </div>
  </div>
</div>
```
