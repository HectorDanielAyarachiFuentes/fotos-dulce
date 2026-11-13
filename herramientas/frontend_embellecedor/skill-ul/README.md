# SKILL-UL — Interactive Lists & Micro-Skill Visual Components

> Enfoque: Repositorios dedicados a mostrar listas interactivas (`<ul>` estilizados), barras de progreso con animaciones fluidas, etiquetas dinámicas y badges flotantes.

## Qué incluye
- **Listas &lt;ul&gt; Estilizadas:** Bullets luminosos, hover con desplazamiento de resorte y micro-estados.
- **Barras de Progreso Fluidas:** Animación con `IntersectionObserver`, brillo diagonal (`@keyframes skillShimmer`) y contador numérico interactivo.
- **Badges con Destello (Shine Sweep):** Reflejo oblicuo en hover con `transform: skewX` y levitación flotante continua (`.skill-badge-floating`).
- **Acordeones con Spring Physics:** Apertura y cierre ultra suaves utilizando `grid-template-rows` y rotación de chevrons.
- **Widget de Radar Canvas:** Generador de gráficos de radar interactivo nativo, ligero y sin dependencias pesadas.

## Uso Rápido
```html
<link rel="stylesheet" href="./skill-ul/styles/skill-ul.css">
<script type="module" src="./skill-ul/components/skill-bars.js"></script>
<script type="module" src="./skill-ul/components/skill-radar.js"></script>
<script type="module" src="./skill-ul/components/collapsible-list.js"></script>

<!-- Badges con Destello -->
<span class="skill-badge-shine skill-badge-floating">TypeScript</span>

<!-- Barras de Progreso -->
<div class="skill-bar-group">
  <div class="skill-bar-wrapper">
    <div class="skill-bar-header">
      <span>Frontend</span>
      <span class="skill-bar-percent">0%</span>
    </div>
    <div class="skill-bar-track">
      <div class="skill-bar-fill" data-value="95"></div>
    </div>
  </div>
</div>
```
