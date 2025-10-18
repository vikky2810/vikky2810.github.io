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

    // Load and display blogs
    loadBlogs();
});

// Function to load blogs from JSON file
async function loadBlogs() {
    try {
        const response = await fetch('src/blogs.json');
        const data = await response.json();
        displayBlogs(data.blogs);
    } catch (error) {
        console.error('Error loading blogs:', error);
        // Fallback: display a message if JSON fails to load
        const container = document.getElementById('blogs-container');
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Blogs coming soon...</p>';
    }
}

// Function to display blogs
function displayBlogs(blogs) {
    const container = document.getElementById('blogs-container');
    
    if (!container) {
        console.error('Blogs container not found');
        return;
    }

    // Sort blogs by date (newest first) and take only the first 3
    const recentBlogs = blogs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    container.innerHTML = recentBlogs.map(blog => `
        <div class="blog-card">
            <div class="blog-image">
                <img src="${getCorrectImagePath(blog.image)}" alt="${blog.alt}" loading="lazy" />
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${blog.category}</span>
                    <span class="blog-date">${formatDate(blog.date)}</span>
                </div>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-description">${blog.summary}</p>
                <div class="blog-footer">
                    <span class="blog-read-time">${blog.readTime}</span>
                    <button class="blog-btn" onclick="openBlog(${blog.id})">Read More</button>
                </div>
            </div>
        </div>
    `).join('');
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
    // If we're on the main portfolio page (index.html), use the original path
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const correctedPath = imagePath.replace('../assets/', 'src/assets/');
        console.log('Main page - Original path:', imagePath, 'Corrected path:', correctedPath);
        return correctedPath;
    }
    // If we're on blog pages, use the relative path
    console.log('Blog page - Using path:', imagePath);
    return imagePath;
}

// Function to handle blog click
function openBlog(blogId) {
    if (blogId) {
        // Navigate to the dynamic blog page with the blog ID
        window.location.href = `src/blog/blog.html?id=${blogId}`;
    } else {
        console.log('Blog ID not provided');
    }
}
  