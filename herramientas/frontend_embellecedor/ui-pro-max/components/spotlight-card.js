/**
 * UI-PRO-MAX — Spotlight Cursor Tracker
 * Dynamically binds mouse coordinates to CSS custom properties for radial spotlight glow.
 */
export function initSpotlightCards(selector = '.pro-spotlight-card') {
  const cards = document.querySelectorAll(selector);

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initSpotlightCards();
  });
}
