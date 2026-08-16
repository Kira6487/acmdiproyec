window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.initNavigation = function initNavigation() {
  const menuLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = document.querySelectorAll('main section[id], header[id]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) return;

      menuLinks.forEach((link) => {
        const target = link.getAttribute('href').slice(1);
        link.classList.toggle('active', target === visibleSection.target.id);
      });
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.15, 0.4] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
};
