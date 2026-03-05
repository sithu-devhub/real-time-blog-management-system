// Index page background icon animation 

function randomizeIcons() {
const icons = document.querySelectorAll('.blog-icon');
const placed = [];
const heroText = document.querySelector('.hero-text');
const heroRect = heroText.getBoundingClientRect();

icons.forEach(icon => {
    let attempts = 0;
    let top, left, tooClose;

    do {
    tooClose = false;
    top = Math.floor(Math.random() * 85) + 5;
    left = Math.floor(Math.random() * 85) + 5;

    // Convert % position to pixel values relative to the viewport
    const iconX = window.innerWidth * (left / 100);
    const iconY = window.innerHeight * (top / 100);

    // Check distance from already placed icons
    for (const pos of placed) {
        const dx = pos.left - left;
        const dy = pos.top - top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 10) {
        tooClose = true;
        break;
        }
    }

    // Check if the new position is too close to the hero text
    const buffer = 100; // pixel buffer around the hero text box
    if (
        iconX > heroRect.left - buffer &&
        iconX < heroRect.right + buffer &&
        iconY > heroRect.top - buffer &&
        iconY < heroRect.bottom + buffer
    ) {
        tooClose = true;
    }

    attempts++;
    } while (tooClose && attempts < 50);

    // Apply position
    icon.style.top = `${top}%`;
    icon.style.left = `${left}%`;

    // Add random delay
    icon.style.animationDelay = `${Math.random() * 3}s`;

    placed.push({ top, left });
});
}

document.addEventListener('DOMContentLoaded', randomizeIcons);
