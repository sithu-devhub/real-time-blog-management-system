// script.
// document.addEventListener('DOMContentLoaded', function () {
//   let tags = !{JSON.stringify(tagListArray || [])};
//   const input = document.getElementById('tagsInput');
//   const hiddenInput = document.getElementById('tagsHidden');
//   const tagContainer = document.getElementById('tag-container');

//   function renderTags() {
//     tagContainer.innerHTML = '';
//     tags.forEach(tag => {
//       const span = document.createElement('span');
//       span.className = 'badge bg-purple text-white me-2 mb-2 tag-badge';
//       span.textContent = tag;

//       const icon = document.createElement('i');
//       icon.className = 'bi bi-x ms-2 text-white cursor-pointer';
//       icon.dataset.tag = tag;
//       icon.addEventListener('click', () => removeTagByText(tag));

//       span.appendChild(icon);
//       tagContainer.appendChild(span);
//     });

//     tagContainer.appendChild(input);
//     hiddenInput.value = tags.join(',');
//     setTimeout(() => input.focus(), 0);
//   }

//   function removeTagByText(tagText) {
//     tags = tags.filter(t => t !== tagText);
//     renderTags();
//   }

//   input.addEventListener('keydown', function (e) {
//     const value = this.value.trim();
//     if ((e.key === ' ' || e.key === 'Enter') && value !== '') {
//       e.preventDefault();
//       if (value.length > 200) {
//         showCustomAlert('Each tag must be 200 characters or less.');
//         this.value = '';
//         return;
//       }
//       const currentTotalLength = tags.join(' ').length;
//       if (currentTotalLength + value.length > 2000) {
//         showCustomAlert('Total tags must not exceed 2000 characters.');
//         this.value = '';
//         return;
//       }
//       if (!tags.includes(value)) {
//         tags.push(value);
//         renderTags();
//       }
//       this.value = '';
//     }
//   });

//   renderTags();
//   input.focus();
// });
