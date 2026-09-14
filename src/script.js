function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
    const isOpen = menu.classList.contains("open");
    icon.setAttribute("aria-expanded", isOpen ? "true" : "false");
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

    // Fade each section up as it enters the viewport, staggering the rows
    // inside it. Skipped for reduced-motion users so nothing starts hidden.
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const rows = ':scope > :not(.exp-list, .projects-list, .blogs-container, .contact-links, .icon-sprite), .exp-row, .project-row, .blog-row, .contact-link-row';
        const observer = new IntersectionObserver((entries) => {
            entries.filter(e => e.isIntersecting).forEach(({ target }) => {
                observer.unobserve(target);
                target.querySelectorAll('.reveal').forEach(el => {
                    // Drop the reveal styles once done so the rows' own hover transitions apply again
                    el.addEventListener('transitionend', e => {
                        if (e.target === el) el.classList.remove('reveal', 'is-visible');
                    });
                    el.classList.add('is-visible');
                });
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        document.querySelectorAll('body > section').forEach(section => {
            section.querySelectorAll(rows).forEach((el, i) => {
                el.style.setProperty('--i', Math.min(i, 8));
                el.classList.add('reveal');
            });
            observer.observe(section);
        });
    }

    // Underline the nav link for the section being read. The active section is
    // the last one whose top has scrolled past a line just below the sticky nav.
    const navLinks = document.querySelectorAll('#desktop-nav a[href^="#"], #mobile-menu a[href^="#"]');
    const navSections = [...new Set([...navLinks].map(a => a.getAttribute('href')))]
        .map(href => document.querySelector(href))
        .filter(Boolean);
    if (navSections.length) {
        const updateActiveNav = () => {
            const line = window.innerHeight * 0.3;
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            let current = null;
            if (atBottom) {
                current = navSections[navSections.length - 1];
            } else {
                navSections.forEach(section => {
                    if (section.getBoundingClientRect().top <= line) current = section;
                });
            }
            const id = current ? '#' + current.id : null;
            navLinks.forEach(a => {
                const active = a.getAttribute('href') === id;
                a.classList.toggle('is-active', active);
                if (active) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        };
        updateActiveNav();
        window.addEventListener('scroll', updateActiveNav, { passive: true });
        window.addEventListener('resize', updateActiveNav, { passive: true });
    }

    // Keep the footer copyright year current
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});
