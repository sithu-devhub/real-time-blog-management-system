// Profile icon - appear profile name on click
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.profileBtn');

  buttons.forEach((btn) => {
    const tooltip = btn.nextElementSibling;

    if (
      tooltip &&
      tooltip.classList.contains('profileTooltip') &&
      !btn.hasAttribute('data-initialized')
    ) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other tooltips
        document.querySelectorAll('.profileTooltip').forEach((el) => {
          if (el !== tooltip) el.style.display = 'none';
        });

        tooltip.style.display =
          tooltip.style.display === 'block' ? 'none' : 'block';
      });

      document.addEventListener('click', () => {
        tooltip.style.display = 'none';
      });

      tooltip.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      btn.setAttribute('data-initialized', 'true');
    }
  });
});
