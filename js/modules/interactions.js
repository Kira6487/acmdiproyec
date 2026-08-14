window.ACMDiproyec = window.ACMDiproyec || {};

window.ACMDiproyec.updateCurrentYear = function updateCurrentYear() {
  const currentYear = document.querySelector('#current-year');
  currentYear.textContent = new Date().getFullYear();
};
