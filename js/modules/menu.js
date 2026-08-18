window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.initMenu = function initMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const mainMenu = document.querySelector('.main-nav');
  const menuBackdrop = document.querySelector('.menu-backdrop');
  const closeButton = mainMenu?.querySelector('.mobile-menu__close');
  const menuLinks = mainMenu?.querySelectorAll('a') || [];
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  let scrollPosition = 0;

  if (!menuButton || !mainMenu || !menuBackdrop || !closeButton) return;

  function getFocusableElements() {
    return [...mainMenu.querySelectorAll('a[href], button:not([disabled])')]
      .filter((element) => !element.hidden && element.getClientRects().length > 0);
  }

  function setMenuState(isOpen) {
    if (isOpen && !mobileQuery.matches) return;

    if (isOpen) {
      scrollPosition = window.scrollY;
      document.body.style.setProperty('--menu-scroll-offset', `-${scrollPosition}px`);
    }

    mainMenu.classList.toggle('open', isOpen);
    menuButton.classList.toggle('is-open', isOpen);
    menuBackdrop.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación',
    );
    document.body.classList.toggle('menu-open', isOpen);
    mainMenu.inert = !isOpen && mobileQuery.matches;

    if (isOpen) {
      window.requestAnimationFrame(() => closeButton.focus());
    } else {
      document.body.style.removeProperty('--menu-scroll-offset');
      window.scrollTo({ top: scrollPosition, left: 0, behavior: 'instant' });
    }
  }

  function closeMenu(returnFocus = true) {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;

    setMenuState(false);
    if (returnFocus) menuButton.focus({ preventScroll: true });
  }

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    setMenuState(isOpen);
  });

  closeButton.addEventListener('click', () => closeMenu());
  menuLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));
  menuBackdrop.addEventListener('click', () => closeMenu());

  document.addEventListener('keydown', (event) => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  function syncResponsiveState() {
    if (!mobileQuery.matches) {
      closeMenu(false);
      mainMenu.inert = false;
      return;
    }

    mainMenu.inert = menuButton.getAttribute('aria-expanded') !== 'true';
  }

  mobileQuery.addEventListener('change', syncResponsiveState);
  syncResponsiveState();
};
