const menuButton = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('.main-nav');
const menuLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('main section[id], header[id]');
const currentYear = document.querySelector('#current-year');

function closeMenu() {
  mainMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = mainMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', isOpen);
});

menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

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

currentYear.textContent = new Date().getFullYear();
