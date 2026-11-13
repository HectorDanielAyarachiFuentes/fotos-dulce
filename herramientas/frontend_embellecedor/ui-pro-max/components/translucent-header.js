/**
 * UI-PRO-MAX — Translucent Glass Header Scroll Observer
 * Dynamically updates header backdrop blur and elevation border on scroll.
 */
export function initTranslucentHeader(selector = '.pro-header-glass', threshold = 20) {
  const header = document.querySelector(selector);
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > threshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initTranslucentHeader();
  });
}
