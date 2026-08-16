window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.initScrollAnimations = function initScrollAnimations() {
  const revealElements = [...document.querySelectorAll('.reveal')];
  const parallaxElements = [...document.querySelectorAll('[data-parallax]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    document.documentElement.classList.add('reveal-ready');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  if (!parallaxElements.length) return;

  let frameRequested = false;

  function updateParallax() {
    frameRequested = false;

    if (reducedMotion.matches || window.innerWidth <= 900) {
      parallaxElements.forEach((element) => element.style.setProperty('--parallax-y', '0px'));
      return;
    }

    parallaxElements.forEach((element) => {
      const bounds = element.parentElement.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) / window.innerHeight;
      const offset = Math.max(-26, Math.min(26, progress * 32));
      element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    });
  }

  function requestParallaxUpdate() {
    if (frameRequested) return;

    frameRequested = true;
    window.requestAnimationFrame(updateParallax);
  }

  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate, { passive: true });
  reducedMotion.addEventListener('change', requestParallaxUpdate);
  requestParallaxUpdate();
};
