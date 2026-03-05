// Login/Logout Flash Messages Handler

// Auto-dismiss all flash messages on index page - During login and logout
document.addEventListener('DOMContentLoaded', function () {
const toastElList = [].slice.call(document.querySelectorAll('.toast'));
toastElList.forEach(function (toastEl) {
    new bootstrap.Toast(toastEl).show();
});
});


// Auto-dismiss all flash messages - Inside Register and Login Forms
document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert.fade.show');
    alerts.forEach(alert => {
      setTimeout(() => {
        alert.classList.remove('show'); // triggers fade out
        setTimeout(() => alert.remove(), 300); // wait for fade to finish
      }, 2000); // 2 seconds visible
    });
  });