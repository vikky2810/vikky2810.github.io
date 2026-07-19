// Blog Index Page JavaScript

// Global variables
let allBlogs = [];
let filteredBlogs = [];
let currentFilter = 'all';

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Main initialization function
async function initializePage() {
    try {
        // Load blogs from JSON
        await loadBlogs();
        
        // Setup filter functionality
        setupFilters();
        
        // Display all blogs initially
        displayBlogs(allBlogs);
        
        // Update stats
        updateStats();
        
        // Setup image error handling
        setupImageErrorHandling();
        
    } catch (error) {
        console.error('Error initializing page:', error);
        showError('Failed to load blogs. Please try again later.');
    }
}

// Function to load blogs from JSON file
async function loadBlogs() {
    try {
        const response = await fetch('../blogs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allBlogs = data.blogs || [];
        filteredBlogs = [...allBlogs];
        
        // Sort blogs by date (newest first)
        allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        throw error;
    }
}

// Function to display blogs in cards
function displayBlogs(blogs) {
    const container = document.getElementById('blog-cards-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (!container) {
        console.error('Blog cards container not found');
        return;
    }

    // Hide loading spinner
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }

    if (!blogs || blogs.length === 0) {
        container.innerHTML = `
            <div class="no-blogs-message">
                <h3>No blogs found</h3>
                <p>Check back later for new content!</p>
            </div>
        `;
        return;
    }

    // Create blog rows HTML
    container.innerHTML = blogs.map(blog => createBlogCard(blog)).join('');

    // Add fade-in animation to rows
    const rows = container.querySelectorAll('.blog-row');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';

        setTimeout(() => {
            row.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Function to create individual blog row HTML (matches the portfolio home listing)
function createBlogCard(blog) {
    const formattedDate = formatDate(blog.date);

    return `
        <div class="blog-row" data-category="${blog.category.toLowerCase()}" onclick="openBlog(${blog.id})">
            <div class="blog-row-main">
                <h3 class="blog-row-title">${blog.title}</h3>
                <p class="blog-row-desc">${blog.summary}</p>
                <span class="blog-row-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    ${formattedDate}
                </span>
            </div>
            <span class="blog-row-more">
                Read more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
        </div>
    `;
}

// Function to setup filter functionality
function setupFilters() {
    const filterButtons = document.getElementById('filter-buttons');
    if (!filterButtons) return;

    // Get unique categories from blogs
    const categories = [...new Set(allBlogs.map(blog => blog.category))];
    
    // Create filter buttons
    const filterButtonsHTML = `
        <button class="filter-btn active" data-category="all">All</button>
        ${categories.map(category => `
            <button class="filter-btn" data-category="${category.toLowerCase()}">${category}</button>
        `).join('')}
    `;
    
    filterButtons.innerHTML = filterButtonsHTML;
    
    // Add click event listeners to filter buttons
    filterButtons.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const category = e.target.getAttribute('data-category');
            filterBlogs(category);
            updateActiveFilter(e.target);
        }
    });
}

// Function to filter blogs by category
function filterBlogs(category) {
    currentFilter = category;
    
    if (category === 'all') {
        filteredBlogs = [...allBlogs];
    } else {
        filteredBlogs = allBlogs.filter(blog => 
            blog.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Sort filtered blogs by date
    filteredBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display filtered blogs
    displayBlogs(filteredBlogs);
}

// Function to update active filter button
function updateActiveFilter(activeButton) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

// Function to update statistics
function updateStats() {
    const totalBlogsElement = document.getElementById('total-blogs');
    const totalCategoriesElement = document.getElementById('total-categories');
    
    if (totalBlogsElement) {
        animateNumber(totalBlogsElement, allBlogs.length);
    }
    
    if (totalCategoriesElement) {
        const uniqueCategories = new Set(allBlogs.map(blog => blog.category));
        animateNumber(totalCategoriesElement, uniqueCategories.size);
    }
}

// Function to animate number counting
function animateNumber(element, targetNumber) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startNumber = 0;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOutQuart);
        
        element.textContent = currentNumber;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = targetNumber;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Function to get correct image path based on current page location
function getCorrectImagePath(imagePath) {
    // Since we're on the blog page, use the relative path from blogs.json
    return imagePath;
}

// Function to handle blog click
function openBlog(blogId) {
    if (blogId) {
        // Navigate to the dynamic blog page with the blog ID
        window.location.href = `blog.html?id=${blogId}`;
    } else {
        console.log('Blog ID not provided');
    }
}

// Function to setup image error handling
function setupImageErrorHandling() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            const currentSrc = img.src;
            
            // Try to load PNG version if WebP fails
            if (currentSrc.includes('.webp')) {
                img.src = currentSrc.replace('.webp', '.png');
            } else {
                // If still fails, try alternative paths
                if (currentSrc.includes('../assets/')) {
                    img.src = currentSrc.replace('../assets/', '../../assets/');
                } else if (currentSrc.includes('../../assets/')) {
                    img.src = currentSrc.replace('../../assets/', '../assets/');
                }
            }
        }
    }, true);
}

// Function to show error message
function showError(message) {
    const container = document.getElementById('blog-cards-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button class="btn btn-color-1" onclick="location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Function to toggle mobile menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    
    if (menu && icon) {
        menu.classList.toggle("open");
        icon.classList.toggle("open");
    }
}

// Function to handle search functionality (for future enhancement)
function searchBlogs(query) {
    if (!query.trim()) {
        filterBlogs(currentFilter);
        return;
    }
    
    const searchResults = allBlogs.filter(blog => 
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.summary.toLowerCase().includes(query.toLowerCase()) ||
        blog.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayBlogs(searchResults);
}

// Function to handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        
        if (menu && icon && menu.classList.contains('open')) {
            menu.classList.remove('open');
            icon.classList.remove('open');
        }
    }
});

// Function to handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        
        if (menu && icon && menu.classList.contains('open')) {
            menu.classList.remove('open');
            icon.classList.remove('open');
        }
    }
});

// Function to add smooth scrolling to anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Export functions for potential external use
window.blogFunctions = {
    loadBlogs,
    displayBlogs,
    filterBlogs,
    searchBlogs,
    openBlog,
    toggleMenu
};
