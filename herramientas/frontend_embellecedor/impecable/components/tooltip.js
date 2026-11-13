/**
 * IMPECCABLE UI — High Precision Tooltip Micro-Engine
 * Positions tooltips mathematically with viewport boundary clipping prevention.
 */
export function initTooltips(selector = '[data-tooltip]') {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    let tooltipEl = null;

    el.addEventListener('mouseenter', () => {
      const text = el.getAttribute('data-tooltip');
      if (!text) return;

      tooltipEl = document.createElement('div');
      tooltipEl.className = 'imp-tooltip';
      tooltipEl.textContent = text;
      tooltipEl.style.opacity = '0';
      tooltipEl.style.position = 'fixed';
      tooltipEl.style.zIndex = '9999';
      document.body.appendChild(tooltipEl);

      const rect = el.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();

      let top = rect.top - tooltipRect.height - 8;
      let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

      // Boundary safety check
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      if (top < 8) {
        top = rect.bottom + 8; // Flip to bottom
      }

      tooltipEl.style.top = `${top}px`;
      tooltipEl.style.left = `${left}px`;
      requestAnimationFrame(() => {
        if (tooltipEl) tooltipEl.style.opacity = '1';
      });
    });

    el.addEventListener('mouseleave', () => {
      if (tooltipEl) {
        tooltipEl.remove();
        tooltipEl = null;
      }
    });
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initTooltips();
  });
}
