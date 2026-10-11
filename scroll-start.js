// A plain portfolio URL should open at the hero, even when Safari restores
// a previous visit. Keep intentional links to individual sections working.
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  if (location.hash === '#main') {
    history.replaceState(history.state, '', location.pathname + location.search);
  }

  let interacted = false;
  const stopResetting = () => { interacted = true; };
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(type => {
    window.addEventListener(type, stopResetting, { passive: true });
  });

  const resetToTop = () => {
    if (interacted || (location.hash && location.hash !== '#top')) return;
    // Override the site's smooth scrolling so restoration cannot animate down.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  resetToTop();
  window.addEventListener('DOMContentLoaded', resetToTop, { once: true });
  window.addEventListener('load', resetToTop, { once: true });
  window.addEventListener('pageshow', event => {
    if (event.persisted) interacted = false;
    resetToTop();
    requestAnimationFrame(resetToTop);
  });
})();
