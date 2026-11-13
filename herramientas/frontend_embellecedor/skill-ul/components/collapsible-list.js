/**
 * SKILL-UL — Spring Physics Collapsible List Engine
 * Toggles accordion/collapsible lists with spring-like cubic-bezier physics.
 */
export function initCollapsibleLists(selector = '.skill-collapsible') {
  const collapsibles = document.querySelectorAll(selector);

  collapsibles.forEach(col => {
    const trigger = col.querySelector('.skill-collapsible-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      col.classList.toggle('is-open');
    });
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initCollapsibleLists();
  });
}
