window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.initCarousel = function initCarousel() {
  const carousels = [...document.querySelectorAll('[data-carousel]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!carousels.length) return;

  document.documentElement.classList.add('carousel-ready');

  carousels.forEach((carousel) => {
    if (carousel.dataset.carouselInitialized === 'true') return;

    const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
    const previousButton = carousel.querySelector('[data-carousel-previous]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const pauseButton = carousel.querySelector('[data-carousel-toggle]');
    const pauseIcon = carousel.querySelector('[data-carousel-toggle-icon]');
    const indicatorsContainer = carousel.querySelector('[data-carousel-indicators]');
    const status = carousel.querySelector('[data-carousel-status]');
    const viewport = carousel.querySelector('[data-carousel-viewport]') || carousel;
    const measureButtons = [...(carousel.closest('.product-card')?.querySelectorAll('[data-carousel-measure]') || [])]
      .filter((element) => element.matches('button'));
    const autoplayDuration = Number(carousel.dataset.carouselAutoplay) || 0;
    let dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
    let currentSlide = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let timerId = null;
    let userPaused = false;
    let interactionPaused = false;
    let pointerStartX = null;

    if (!slides.length) return;

    carousel.dataset.carouselInitialized = 'true';

    if (indicatorsContainer && !dots.length) {
      slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.className = 'content-carousel__dot';
        dot.type = 'button';
        dot.dataset.carouselDot = String(index);
        dot.setAttribute('aria-label', `Mostrar imagen ${index + 1} de ${slides.length}`);
        indicatorsContainer.append(dot);
      });
      dots = [...indicatorsContainer.querySelectorAll('[data-carousel-dot]')];
    }

    if (slides.length === 1) carousel.setAttribute('data-carousel-single', '');

    function updatePauseControl() {
      if (!pauseButton) return;

      pauseButton.hidden = reducedMotion.matches || !autoplayDuration;
      pauseButton.setAttribute('aria-pressed', String(userPaused));
      pauseButton.setAttribute('aria-label', userPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
      if (pauseIcon) pauseIcon.textContent = userPaused ? '▶' : 'Ⅱ';
    }

    function showSlide(index, announce = true) {
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        if (isActive && slide instanceof HTMLImageElement) slide.loading = 'eager';
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      const activeMeasure = slides[currentSlide].dataset.carouselMeasure || '';
      measureButtons.forEach((button) => {
        const isActive = activeMeasure !== '' && button.dataset.carouselMeasure === activeMeasure;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      if (status) {
        status.textContent = `Imagen ${currentSlide + 1} de ${slides.length}`;
        status.setAttribute('aria-live', announce ? 'polite' : 'off');
      }
    }

    function stopAutoplay() {
      if (timerId === null) return;
      window.clearInterval(timerId);
      timerId = null;
    }

    function startAutoplay() {
      stopAutoplay();
      if (!autoplayDuration || slides.length < 2 || reducedMotion.matches || userPaused || interactionPaused || document.hidden) return;
      timerId = window.setInterval(() => showSlide(currentSlide + 1, false), autoplayDuration);
    }

    function selectSlide(index) {
      showSlide(index);
      startAutoplay();
    }

    previousButton?.addEventListener('click', () => selectSlide(currentSlide - 1));
    nextButton?.addEventListener('click', () => selectSlide(currentSlide + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => selectSlide(index)));
    measureButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetIndex = slides.findIndex(
          (slide) => slide.dataset.carouselMeasure === button.dataset.carouselMeasure,
        );
        if (targetIndex >= 0) selectSlide(targetIndex);
      });
    });

    pauseButton?.addEventListener('click', () => {
      userPaused = !userPaused;
      updatePauseControl();
      startAutoplay();
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') selectSlide(currentSlide - 1);
      else if (event.key === 'ArrowRight') selectSlide(currentSlide + 1);
      else if (event.key === 'Home') selectSlide(0);
      else if (event.key === 'End') selectSlide(slides.length - 1);
      else return;
      event.preventDefault();
    });

    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      pointerStartX = event.clientX;
    }, { passive: true });

    viewport.addEventListener('pointerup', (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) < 45) return;
      selectSlide(currentSlide + (distance < 0 ? 1 : -1));
    }, { passive: true });

    viewport.addEventListener('pointercancel', () => { pointerStartX = null; }, { passive: true });
    carousel.addEventListener('mouseenter', () => { interactionPaused = true; stopAutoplay(); });
    carousel.addEventListener('mouseleave', () => { interactionPaused = false; startAutoplay(); });
    carousel.addEventListener('focusin', () => { interactionPaused = true; stopAutoplay(); });
    carousel.addEventListener('focusout', (event) => {
      if (carousel.contains(event.relatedTarget)) return;
      interactionPaused = false;
      startAutoplay();
    });

    document.addEventListener('visibilitychange', startAutoplay);
    reducedMotion.addEventListener('change', () => { updatePauseControl(); startAutoplay(); });
    showSlide(currentSlide, false);
    updatePauseControl();
    startAutoplay();
  });
};
