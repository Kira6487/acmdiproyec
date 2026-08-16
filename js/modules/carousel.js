window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.initCarousel = function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');

  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.hero-slide')];
  const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
  const previousButton = carousel.querySelector('[data-carousel-previous]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const pauseButton = carousel.querySelector('[data-carousel-toggle]');
  const pauseIcon = carousel.querySelector('[data-carousel-toggle-icon]');
  const controls = carousel.querySelector('.hero-carousel-controls');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intervalDuration = 5500;
  let currentSlide = 0;
  let timerId = null;
  let userPaused = false;
  let interactionPaused = false;

  if (!slides.length || !previousButton || !nextButton || !pauseButton || !controls) return;

  document.documentElement.classList.add('carousel-ready');

  function updatePauseControl() {
    pauseButton.hidden = reducedMotion.matches;
    pauseButton.setAttribute('aria-pressed', String(userPaused));
    pauseButton.setAttribute('aria-label', userPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
    pauseIcon.textContent = userPaused ? '▶' : 'Ⅱ';
  }

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;
      slide.classList.toggle('is-active', isActive);
      if (isActive) slide.loading = 'eager';
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentSlide;
      dot.classList.toggle('is-active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function stopAutoplay() {
    if (timerId === null) return;

    window.clearInterval(timerId);
    timerId = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion.matches || userPaused || interactionPaused || document.hidden) return;

    timerId = window.setInterval(() => showSlide(currentSlide + 1), intervalDuration);
  }

  function selectSlide(index) {
    showSlide(index);
    startAutoplay();
  }

  previousButton.addEventListener('click', () => selectSlide(currentSlide - 1));
  nextButton.addEventListener('click', () => selectSlide(currentSlide + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => selectSlide(index)));

  pauseButton.addEventListener('click', () => {
    userPaused = !userPaused;
    updatePauseControl();
    startAutoplay();
  });

  carousel.addEventListener('mouseenter', () => {
    interactionPaused = true;
    stopAutoplay();
  });

  carousel.addEventListener('mouseleave', () => {
    interactionPaused = false;
    startAutoplay();
  });

  controls.addEventListener('focusin', () => {
    interactionPaused = true;
    stopAutoplay();
  });

  controls.addEventListener('focusout', (event) => {
    if (controls.contains(event.relatedTarget)) return;

    interactionPaused = false;
    startAutoplay();
  });

  document.addEventListener('visibilitychange', startAutoplay);
  reducedMotion.addEventListener('change', () => {
    updatePauseControl();
    startAutoplay();
  });

  showSlide(0);
  updatePauseControl();
  startAutoplay();
};
