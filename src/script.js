function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Copy email to clipboard with a brief "copied" checkmark
function copyEmail(btn, email) {
    navigator.clipboard.writeText(email).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML =
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btn.style.color = "var(--primary-color)";
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.color = "";
        }, 1500);
    }).catch(() => {});
}

// Handle image loading errors and provide fallbacks
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // If the image fails to load, try to load the PNG version
            const currentSrc = this.src;
            if (currentSrc.includes('.webp')) {
                this.src = currentSrc.replace('.webp', '.png');
            } else if (currentSrc.includes('project-')) {
                // For project images, try fallback to PNG version
                this.src = currentSrc.replace('.webp', '.png');
            } else {
                // If still fails, try alternative paths
                if (currentSrc.includes('../assets/')) {
                    this.src = currentSrc.replace('../assets/', 'src/assets/');
                } else if (currentSrc.includes('src/assets/')) {
                    this.src = currentSrc.replace('src/assets/', '../assets/');
                }
            }
        });
    });

    // Fade out the bottom blur strip once the footer is in view, so the
    // footer itself never sits underneath it.
    const scrollFade = document.querySelector('.scroll-fade');
    const footer = document.querySelector('.site-footer');
    if (scrollFade && footer) {
        const updateScrollFade = () => {
            const footerTop = footer.getBoundingClientRect().top;
            scrollFade.classList.toggle('is-hidden', footerTop <= window.innerHeight);
        };
        updateScrollFade();
        window.addEventListener('scroll', updateScrollFade, { passive: true });
        window.addEventListener('resize', updateScrollFade, { passive: true });
    }

    // Keep the footer copyright year current
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});
