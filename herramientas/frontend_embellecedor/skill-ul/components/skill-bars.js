/**
 * SKILL-UL — Animated Progress Bars with Intersection Observer
 * Smoothly animates progress bars and numerical counters when scrolled into view.
 */
export function initSkillBars(containerSelector = '.skill-bar-group') {
  const groups = document.querySelectorAll(containerSelector);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-bar-fill');
        fills.forEach(fill => {
          const targetVal = fill.getAttribute('data-value') || '0';
          fill.style.width = `${targetVal}%`;

          // Counter number animation
          const percentEl = fill.closest('.skill-bar-wrapper')?.querySelector('.skill-bar-percent');
          if (percentEl) {
            animateCounter(percentEl, 0, parseInt(targetVal, 10), 1200);
          }
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  groups.forEach(group => observer.observe(group));
}

function animateCounter(element, start, end, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    const current = Math.floor(easeProgress * (end - start) + start);
    element.textContent = `${current}%`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${end}%`;
    }
  }

  requestAnimationFrame(step);
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initSkillBars();
  });
}
