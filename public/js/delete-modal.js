// Modal handler - When a modal opens, save the current page path into the modal's hidden input >> used for redirectig back

document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
  
    modals.forEach(modal => {
      modal.addEventListener('show.bs.modal', function () {
        const input = modal.querySelector('.redirect-input');
        if (input) {
          input.value = window.location.pathname;
        }
      });
    });
  });
  


  