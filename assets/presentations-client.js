/* Volets natifs et chiffres accessibles au clavier, à la souris et au toucher. */
(() => {
  'use strict';
  const init = () => {
    const id = decodeURIComponent(location.hash.slice(1)).replace(/\/+$/, '');
    if (id && location.hash.slice(1) !== id && document.getElementById(id)) {
      history.replaceState(null, '', location.pathname + location.search + '#' + id);
      document.getElementById(id).scrollIntoView();
    }
    document.querySelectorAll('.scipt-stat').forEach(card => {
      const button = card.querySelector('.scipt-stat-trigger');
      if (!button) return;
      const set = open => {
        card.classList.toggle('is-revealed', open);
        button.setAttribute('aria-expanded', String(open));
      };
      card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') set(true); });
      card.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !card.contains(document.activeElement)) set(false); });
      button.addEventListener('click', event => set(event.pointerType === 'mouse' || !card.classList.contains('is-revealed')));
      card.addEventListener('focusout', e => { if (!card.contains(e.relatedTarget)) set(false); });
      card.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
