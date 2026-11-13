# IMPECCABLE UI — Framework & Kit Pixel-Perfect

> Enfoque: Patrones de interfaz orientados al píxel exacto (pixel-perfect), consistencia visual estricta y estados de interacción pulidos (hover, focus, active).

## Qué incluye
- **Espaciado Matemático (4pt/8pt Grid):** Variables `--imp-space-0` hasta `--imp-space-24` para eliminar medidas arbitrarias.
- **Tipografía Modular Balanceada:** Fórmulas dinámicas con `clamp()` que ajustan tamaño y leading automáticamente a cualquier resolución.
- **Paleta con Contraste Verificado WCAG AAA/AA:** Textos y superficies probados para ratios superiores a 7:1 y 4.5:1.
- **Física de Interacción sin Tosquedad:** Easing ultra pulido (`cubic-bezier(0.16, 1, 0.3, 1)`), micro-scale en `:active` (`0.985`) y rings accesibles en `:focus-visible`.
- **Botones y Formularios de Precisión:** Primitivas atómicas listas para producción con tooltips con evasión de colisiones en bordes de pantalla.

## Uso Rápido
```html
<link rel="stylesheet" href="./impecable/styles/impeccable.css">
<link rel="stylesheet" href="./impecable/styles/buttons.css">
<script type="module" src="./impecable/components/tooltip.js"></script>

<!-- Botón con Tooltip de Precisión -->
<button class="imp-btn imp-btn-primary" data-tooltip="Confirmar acción">
  Guardar Cambios
</button>

<!-- Input con Micro-Estados -->
<input class="imp-input" placeholder="Nombre completo...">
```
