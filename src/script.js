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

    // Load and display projects
    loadProjects();
});

// Embedded projects data (fallback for file:// protocol)
const embeddedProjectsData = {
    "projects": [
        {
            "id": 3,
            "title": "Health-Aware Recipe Modifier",
            "description": "Full-stack Flask app that generates recipes tailored to user-specified medical conditions using the Gemini API — flags harmful ingredients, recommends safe substitutes, and generates PDF summary reports.",
            "github": "https://github.com/vikky2810/Recipe-Modifier",
            "live": "https://recipe-modifier-app.vercel.app"
        },
        {
            "id": 1,
            "title": "AI Explains Repo",
            "description": "Full-stack Next.js app that ingests GitHub repository data and generates AI-powered reports on code quality, architecture, security risks, and performance via the Gemini API, with authenticated session history.",
            "image": "src/assets/pro.png",
            "alt": "AI Explains Repo Project",
            "github": "https://github.com/vikky2810/ai-explains-repo",
            "live": "https://ai-explains-repo.vercel.app/"
        },
        {
            "id": 2,
            "title": "Online Python Code Editor",
            "description": "Browser-based Python editor built with Flask and CodeMirror that executes user code server-side and streams output back in real time, with syntax highlighting, error handling, and a responsive dark UI.",
            "image": "src/assets/project2.png",
            "alt": "Online Python Code Editor",
            "github": "https://github.com/vikky2810/OnlineCodeEditor",
            "live": "https://viks-online-code-editor.vercel.app/"
        }
    ]
};

// Turns "AI Explains Repo" into "ai-explains-repo" so blog posts can deep-link
// to a single project. Must match the ids written into index.html.
function slugifyTitle(title) {
    return String(title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Function to load projects from JSON file
async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) {
        console.error('Projects container not found');
        return; // Not on homepage or section absent
    }
    
    // Check if we're running from file:// protocol (local file)
    const isFileProtocol = window.location.protocol === 'file:';
    
    try {
        let data;
        
        if (isFileProtocol) {
            // Use embedded data for file:// protocol
            console.log('Using embedded project data (file:// protocol detected)');
            data = embeddedProjectsData;
        } else {
            // Try to fetch from JSON file
            const response = await fetch('src/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
        }
        
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
            displayProjects(data.projects);
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Projects coming soon...</p>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to embedded data if fetch fails
        if (embeddedProjectsData && Array.isArray(embeddedProjectsData.projects) && embeddedProjectsData.projects.length > 0) {
            console.log('Falling back to embedded project data');
            displayProjects(embeddedProjectsData.projects);
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Projects coming soon...</p>';
        }
    }
}

// Function to display projects
function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) {
        console.error('Projects container not found');
        return;
    }

    // Validate projects array
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No projects available at the moment.</p>';
        return;
    }

    const cardsHtml = projects
        .filter(project => project && project.title) // Filter out invalid projects
        .map(project => `
        <div class="project-row" id="${slugifyTitle(project.title)}">
            <div class="project-row-top">
                <h3 class="project-row-title">${project.title || 'Untitled Project'}</h3>
                <div class="project-row-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-code" aria-label="GitHub repository">
                        GitHub
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.75.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .31.21.69.83.57A12 12 0 0 0 12 .3z"/></svg>
                    </a>` : ''}
                    ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="project-live" aria-label="Live demo">
                        Live
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>` : ''}
                </div>
            </div>
            ${project.description ? `<p class="project-row-desc">${project.description}</p>` : ''}
        </div>
    `).join('');

    container.innerHTML = cardsHtml || '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No projects to display yet.</p>';

    if (window.location.hash) {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target && container.contains(target)) {
            target.scrollIntoView({ block: 'start' });
        }
    }
}
  
