window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.initMenu = function initMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const mainMenu = document.querySelector('.main-nav');
  const menuBackdrop = document.querySelector('.menu-backdrop');
  const menuLinks = document.querySelectorAll('.main-nav a');

  if (!menuButton || !mainMenu || !menuBackdrop) return;

  function setMenuState(isOpen) {
    mainMenu.classList.toggle('open', isOpen);
    menuButton.classList.toggle('is-open', isOpen);
    menuBackdrop.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación',
    );
    document.body.classList.toggle('menu-open', isOpen);
  }

  function closeMenu() {
    setMenuState(false);
  }

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    setMenuState(isOpen);
  });

  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));
  menuBackdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;

    closeMenu();
    menuButton.focus();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
};
