function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Handle image loading errors and provide fallbacks
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // If the image fails to load, try to load the PNG version
            const currentSrc = this.src;
            if (currentSrc.includes('.webp')) {
                this.src = currentSrc.replace('.webp', '.png');
            }
        });
    });
});
  