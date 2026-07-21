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

    // Load and display blogs
    loadBlogs();

    // Load and display projects
    loadProjects();
});

// Embedded blog data (fallback for file:// protocol)
const embeddedBlogsData = {
    "blogs": [
        {
            "id": 1,
            "title": "Library vs Framework: The Real Difference Every Developer Should Know",
            "summary": "Understanding the difference between a library and a framework is crucial for developers. This guide breaks it down with beginner-friendly explanations, real-world analogies, and practical React and Next.js examples.",
            "image": "../assets/frameworkVSlibrary.png",
            "alt": "Library vs Framework",
            "date": "2025-10-18",
            "readTime": "8 min read",
            "category": "Web Development",
            "content": "<p>If you've ever started a coding project, you've probably asked yourself: \"Should I use a library or a framework?\" They both promise to save you time, provide reusable code, and make development smoother. But the difference between them is bigger than most beginners realize. Choosing the wrong one can turn a simple project into a confusing mess.</p><p>In this post, we'll break down the distinction, give real-world analogies, show examples in modern web development, and even provide code snippets so it clicks immediately.</p><h2>Library vs Framework in One Sentence</h2><p>Here's the cheat code:</p><ul><li><strong>Library:</strong> You're in charge. You call the code when you need it.</li><li><strong>Framework:</strong> It's in charge. It calls your code at specific points.</li></ul><p>This concept is also called \"Inversion of Control\". Basically, with a framework, you follow its rules. With a library, you make the rules.</p><h2>A Side-by-Side Comparison</h2><table><thead><tr><th>Aspect</th><th>Library</th><th>Framework</th></tr></thead><tbody><tr><td>Control Flow</td><td>You call it</td><td>It calls you</td></tr><tr><td>Ownership</td><td>You structure the app</td><td>Framework dictates the structure</td></tr><tr><td>Flexibility</td><td>High</td><td>Medium/Low</td></tr><tr><td>Examples</td><td>React, NumPy, Lodash</td><td>Angular, Django, Next.js</td></tr><tr><td>Analogy</td><td>Toolbox</td><td>Skeleton or meal kit</td></tr></tbody></table><h2>Real-World Analogy: Cooking</h2><p>Imagine you're cooking dinner:</p><ul><li>A library is like a box of ingredients. You can make any dish in any order. You control everything.</li><li>A framework is like a meal kit. It comes with a recipe and a plan. You can add spices or tweak a little, but you're generally following its instructions.</li></ul><p>This is exactly why beginners sometimes feel \"restricted\" with frameworks, they aren't meant to give total freedom. They give structure so you don't have to reinvent the wheel every time.</p><h2>Why This Matters in Web Development</h2><h3>React: The Library</h3><p>React is a library for building UI components. It provides tools to create reusable UI elements like buttons, modals, and navigation bars. But beyond that, you decide:</p><ul><li>How the app is structured</li><li>How routing works</li><li>How data fetching works</li></ul><p>Here's a tiny React example:</p><pre class=\"code-block\"><code class=\"language-js\">import React from \"react\";\n\nfunction Greeting({ name }) {\n  return &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;\n}\n\nexport default Greeting;</code></pre><p>You call this component wherever you want. React doesn't dictate when or how you use it.</p><h3>Next.js: The Framework</h3><p>Next.js is a framework built on React. It handles routing, server-side rendering, static site generation, and more. It dictates certain patterns, like:</p><ul><li>File-based routing (pages/index.js becomes your homepage)</li><li>API routes (pages/api/)</li><li>Built-in optimizations (SSR, SSG, image optimization)</li></ul><p>A tiny Next.js page example:</p><pre class=\"code-block\"><code class=\"language-js\">// pages/index.js\nexport default function Home() {\n  return &lt;h1&gt;Welcome to my Next.js site!&lt;/h1&gt;;\n}</code></pre><p>Notice how you don't need to configure routing, Next.js handles it automatically. That's the framework \"calling your code,\" instead of you calling the library manually.</p><h2>Picking Between a Library and a Framework</h2><ul><li><strong>Project Complexity:</strong> Small or highly customized projects → library (React, Lodash); Larger projects with standard patterns → framework (Next.js, Angular, Django)</li><li><strong>Learning Curve:</strong> Libraries are easier to start with since they're more flexible; Frameworks have more conventions and rules but save time once you understand them.</li><li><strong>Community & Ecosystem:</strong> Both have huge communities, but frameworks often come with built-in tooling; Libraries might require piecing together multiple tools.</li></ul><h2>Code Snippets: Library vs Framework in Action</h2><h3>Using React (Library Approach)</h3><pre class=\"code-block\"><code class=\"language-jsx\">import React, { useEffect, useState } from \"react\";\n\nfunction UsersList() {\n  const [users, setUsers] = useState([]);\n\n  useEffect(() =&gt; {\n    fetch(\"https://jsonplaceholder.typicode.com/users\")\n      .then((res) =&gt; res.json())\n      .then(setUsers);\n  }, []);\n\n  return (\n    &lt;ul&gt;\n      {users.map((user) =&gt; (\n        &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;\n      ))}\n    &lt;/ul&gt;\n  );\n}\n\nexport default UsersList;</code></pre><p>You decide everything: how to fetch, where to store state, when to render.</p><h3>Using Next.js (Framework Approach)</h3><pre class=\"code-block\"><code class=\"language-js\">// pages/users.js\nexport async function getServerSideProps() {\n  const res = await fetch(\"https://jsonplaceholder.typicode.com/users\");\n  const users = await res.json();\n  return { props: { users } };\n}\n\nexport default function Users({ users }) {\n  return (\n    &lt;ul&gt;\n      {users.map((user) =&gt; (\n        &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;\n      ))}\n    &lt;/ul&gt;\n  );\n}</code></pre><p>Here, Next.js decides when and how to fetch data (server-side) and inject it into your page. You just provide the component logic. That's inversion of control in practice.</p><h2>Common Misconceptions</h2><ul><li>\"Libraries are always easier than frameworks\" → Not true. Libraries give flexibility, but you're responsible for app architecture.</li><li>\"Frameworks are restrictive\" → They're structured. That structure can save you time and prevent messy code in large apps.</li><li>\"React is a framework\" → Nope. React is a library; Next.js is a framework built on top of it.</li></ul><h2>Key Takeaways</h2><ul><li>Library = You call it. Flexibility.</li><li>Framework = It calls you. Structure.</li><li>React vs Next.js perfectly illustrates the difference.</li><li>Project choice matters, pick the right tool for the size and complexity of your app.</li><li>Understanding inversion of control will make your life easier when learning frameworks.</li></ul><p>Bottom Line: Knowing the difference between a library and a framework is more than a buzzword. It helps you structure projects correctly, pick the right tools, and avoid unnecessary frustration. Next time someone asks you this in an interview or a project, you'll answer like a pro.</p>"
        }
    ]
};

// Function to load blogs from JSON file
async function loadBlogs() {
    const container = document.getElementById('blogs-container');
    if (!container) {
        console.error('Blogs container not found');
        return;
    }
    
    // Check if we're running from file:// protocol (local file)
    const isFileProtocol = window.location.protocol === 'file:';
    
    try {
        let data;
        
        if (isFileProtocol) {
            // Use embedded data for file:// protocol
            console.log('Using embedded blog data (file:// protocol detected)');
            data = embeddedBlogsData;
        } else {
            // Try to fetch from JSON file
            const response = await fetch('src/blogs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
        }
        
        if (data && Array.isArray(data.blogs) && data.blogs.length > 0) {
            displayBlogs(data.blogs);
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Blogs coming soon...</p>';
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        // Fallback to embedded data if fetch fails
        if (embeddedBlogsData && Array.isArray(embeddedBlogsData.blogs) && embeddedBlogsData.blogs.length > 0) {
            console.log('Falling back to embedded blog data');
            displayBlogs(embeddedBlogsData.blogs);
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Blogs coming soon...</p>';
        }
    }
}

// Function to display blogs
function displayBlogs(blogs) {
    const container = document.getElementById('blogs-container');
    
    if (!container) {
        console.error('Blogs container not found');
        return;
    }

    // Validate blogs array
    if (!blogs || !Array.isArray(blogs) || blogs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No blogs available at the moment.</p>';
        return;
    }

    // Sort blogs by date (newest first) and take only the first 3
    const recentBlogs = blogs
        .filter(blog => blog && blog.date) // Filter out invalid blogs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    if (recentBlogs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No blogs available at the moment.</p>';
        return;
    }

    container.innerHTML = recentBlogs.map(blog => `
        <div class="blog-row" onclick="openBlog(${blog.id})">
            <div class="blog-row-main">
                <h3 class="blog-row-title">${blog.title || 'Untitled'}</h3>
                <p class="blog-row-desc">${blog.summary || ''}</p>
                <span class="blog-row-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    ${formatDate(blog.date)}
                </span>
            </div>
            <span class="blog-row-more">
                Read more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
        </div>
    `).join('');
}

// Function to format date
function formatDate(dateString) {
    if (!dateString) {
        return 'Date not available';
    }
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if formatting fails
    }
}

// Function to get correct image path based on current page location
function getCorrectImagePath(imagePath) {
    if (!imagePath) {
        return 'src/assets/profile-pic.png'; // Fallback image
    }
    
    // If we're on the main portfolio page (index.html), convert relative paths
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        // Convert ../assets/ to src/assets/ for main page
        if (imagePath.startsWith('../assets/')) {
            return imagePath.replace('../assets/', 'src/assets/');
        }
        // If already using src/assets/, return as is
        if (imagePath.startsWith('src/assets/')) {
            return imagePath;
        }
        // If it's a relative path without ../, assume it's from src/assets/
        if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
            return `src/assets/${imagePath}`;
        }
        return imagePath;
    }
    // If we're on blog pages, use the relative path as is
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
        <div class="project-row">
            <div class="project-row-top">
                <h3 class="project-row-title">${project.title || 'Untitled Project'}</h3>
                <div class="project-row-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" aria-label="GitHub repository">
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
}
  
