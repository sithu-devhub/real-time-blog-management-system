document.addEventListener('DOMContentLoaded', () => {
  const indexNavbar = document.getElementById('indexNavbar');
  const defaultNavbar = document.getElementById('defaultNavbar');
  const hero = document.querySelector('.hero-carousel');

  function handleNavbarSwitch() {
    if (!hero || !indexNavbar || !defaultNavbar) return;

    const triggerPoint = hero.offsetHeight - 80;

    if (window.scrollY >= triggerPoint) {
      indexNavbar.classList.add('d-none');
      defaultNavbar.classList.remove('d-none');
    } else {
      indexNavbar.classList.remove('d-none');
      defaultNavbar.classList.add('d-none');
    }
  }

  handleNavbarSwitch();
  window.addEventListener('scroll', handleNavbarSwitch);
  window.addEventListener('resize', handleNavbarSwitch);
});
