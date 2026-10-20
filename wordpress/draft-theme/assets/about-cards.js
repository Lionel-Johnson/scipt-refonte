/* Décoration progressive et lumière au pointeur, avec prise en charge de la réduction des animations. */
(() => {
  'use strict';
  const init = () => {
    const cards = window.SCIPT_ABOUT_CARDS;
    if (!cards) return;
    const pointerEffects = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.about-subnav').forEach(nav => {
      nav.classList.add('scipt-about-cards', 'scipt-about-aurora');
      nav.querySelectorAll('a[href^="#"]').forEach(link => {
        const card = cards[link.hash.slice(1)];
        if (!card) return;
        if (!link.querySelector('.sc-about-card-title')) link.innerHTML = card.markup;
        link.classList.add('sc-about-card');
        link.dataset.aboutTitle = card.title;
        link.setAttribute('aria-label', 'Découvrir : ' + card.title);
        if (!pointerEffects || link.dataset.auroraReady) return;
        link.dataset.auroraReady = 'true';
        let frame = 0, point;
        link.addEventListener('pointermove', event => {
          if (event.pointerType !== 'mouse') return;
          point = {x:event.clientX, y:event.clientY};
          if (frame) return;
          frame = requestAnimationFrame(() => {
            const rect = link.getBoundingClientRect();
            link.style.setProperty('--sc-pointer-x', (point.x - rect.left) + 'px');
            link.style.setProperty('--sc-pointer-y', (point.y - rect.top) + 'px');
            frame = 0;
          });
        });
        link.addEventListener('pointerleave', () => {
          cancelAnimationFrame(frame);frame = 0;
          link.style.removeProperty('--sc-pointer-x');
          link.style.removeProperty('--sc-pointer-y');
        });
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
