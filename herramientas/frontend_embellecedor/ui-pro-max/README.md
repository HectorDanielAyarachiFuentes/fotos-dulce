# UI-PRO-MAX — High-End UX/UI Component Suite

> Enfoque: Colecciones de componentes avanzados con microanimaciones, bordes dinámicos y estilos oscuros profundos para interfaces de alta gama.

## Qué incluye
- **Paleta Deep Obsidian:** Fondos ultra oscuros (`#050508`, `#0c0d14`, `#13141f`) con contrastes calculados.
- **Fondo Mesh Aurora:** Animaciones de luz difusa en loop con aceleración GPU (`@keyframes proAuroraLeft`, `proAuroraRight`).
- **Header Translúcido (Glassmorphism):** Blur de 20px, saturación 180% y elevación dinámica en scroll (`.pro-header-glass.is-scrolled`).
- **Borde Beam Cinético:** Haz de luz cónico rotativo (`.pro-beam-card`, `proRotateBeam`).
- **Spotlight Cards:** Detección de cursor en tiempo real (`--mouse-x`, `--mouse-y`) con resplandor radial dinámico.
- **Badges de Neón:** Pulso sutil y estados activos con caja de sombra fluorescente.

## Uso Rápido
```html
<link rel="stylesheet" href="./ui-pro-max/styles/ui-pro-max.css">
<script type="module" src="./ui-pro-max/components/spotlight-card.js"></script>
<script type="module" src="./ui-pro-max/components/translucent-header.js"></script>

<!-- Header Glass -->
<header class="pro-header-glass">...</header>

<!-- Tarjeta Beam Dinámica -->
<div class="pro-beam-card">
  <div class="pro-beam-content">...</div>
</div>

<!-- Tarjeta Spotlight Reactiva -->
<div class="pro-spotlight-card">...</div>
```
