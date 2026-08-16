window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.updateCurrentYear = function updateCurrentYear() {
  const currentYear = document.querySelector('#current-year');
  if (!currentYear) return;

  currentYear.textContent = new Date().getFullYear();
};
