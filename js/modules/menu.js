window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.initMenu = function initMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const mainMenu = document.querySelector('.main-nav');
  const menuLinks = document.querySelectorAll('.main-nav a');

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
};
