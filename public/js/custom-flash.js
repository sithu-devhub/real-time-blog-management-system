// Global Flash Alert Handling

// This was used in Create Post page - for title and content max character length validation flash message appearing and auto removal
// Without this, when page was scrolled down, when normal already existing alert appears, we have to scroll up to view it
// So this was used to create a message at top right corner of page even though we have scrolled down. 
// But now, we do not allow typing characters and now using character count. So this is not needed now as max character length cannot be exceeded.

// function showCustomAlert(message) {
// const container = document.getElementById('custom-alert');
// const isScrolled = window.scrollY > 100;
// container.innerHTML = `
//     <div class="alert alert-danger alert-dismissible fade show" role="alert" style="${isScrolled ? 'position: fixed; top: 80px; right: 20px; z-index: 99999; max-width: 200px; background: #f8d7da; border: 1px solid #f5c2c7;' : 'margin-top: 1rem;'}">
//     ${message}
//     <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//     </div>`;
// if (!isScrolled) {
//     container.scrollIntoView({ behavior: 'smooth', block: 'start' });
// }
// setTimeout(() => {
//     const alert = container.querySelector('.alert');
//     if (alert) {
//     alert.classList.remove('show');
//     setTimeout(() => alert.remove(), 300);
//     }
// }, 3000);
// }