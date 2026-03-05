// Close button action - Create Post, Edit Post, View Ppost
function closeFormAndGoToMyposts() {
  // Clear custom client-side alert
  const customAlert = document.getElementById('custom-alert');
  if (customAlert) {
    customAlert.innerHTML = '';
    customAlert.style.display = 'none'; // Hide it too
  }

  // Remove all server-side flash alerts (success and error)
  document.querySelectorAll('.alert').forEach(alert => {
    alert.remove();
  });

  // reset title and content character counters if they exist
  const titleCharCount = document.getElementById('titleCharCount');
  if (titleCharCount) titleCharCount.innerText = '0 / 2000';
  const contentCharCount = document.getElementById('contentCharCount');
  if (contentCharCount) contentCharCount.innerText = '0 / 20000';

  // Try to go back, if possible
  if (document.referrer && document.referrer !== window.location.href) {
    setTimeout(() => {
      history.back();
    }, 20); // 20 milliseconds delay
  } else {
    // Fallback if no referrer: redirect to /posts/myposts
    setTimeout(() => {
      window.location.href = '/posts/myposts';
    }, 20);
  }
}
