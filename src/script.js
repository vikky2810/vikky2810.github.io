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
            "content": "<p>If you've ever started a coding project, you've probably asked yourself: \"Should I use a library or a framework?\" They both promise to save you time, provide reusable code, and make development smoother. But the difference between them is bigger than most beginners realize. Choosing the wrong one can turn a simple project into a confusing mess.</p><p>In this post, we'll break down the distinction, give real-world analogies, show examples in modern web development, and even provide code snippets so it clicks immediately.</p><h2>Library vs Framework in One Sentence</h2><p>Here's the cheat code:</p><ul><li><strong>Library:</strong> You're in charge. You call the code when you need it.</li><li><strong>Framework:</strong> It's in charge. It calls your code at specific points.</li></ul><p>This concept is also called \"Inversion of Control\". Basically, with a framework, you follow its rules. With a library, you make the rules.</p><h2>A Side-by-Side Comparison</h2><table><thead><tr><th>Aspect</th><th>Library</th><th>Framework</th></tr></thead><tbody><tr><td>Control Flow</td><td>You call it</td><td>It calls you</td></tr><tr><td>Ownership</td><td>You structure the app</td><td>Framework dictates the structure</td></tr><tr><td>Flexibility</td><td>High</td><td>Medium/Low</td></tr><tr><td>Examples</td><td>React, NumPy, Lodash</td><td>Angular, Django, Next.js</td></tr><tr><td>Analogy</td><td>Toolbox</td><td>Skeleton or meal kit</td></tr></tbody></table><h2>Real-World Analogy: Cooking</h2><p>Imagine you're cooking dinner:</p><ul><li>A library is like a box of ingredients. You can make any dish in any order. You control everything.</li><li>A framework is like a meal kit. It comes with a recipe and a plan. You can add spices or tweak a little, but you're generally following its instructions.</li></ul><p>This is exactly why beginners sometimes feel \"restricted\" with frameworks — they aren't meant to give total freedom. They give structure so you don't have to reinvent the wheel every time.</p><h2>Why This Matters in Web Development</h2><h3>React: The Library</h3><p>React is a library for building UI components. It provides tools to create reusable UI elements like buttons, modals, and navigation bars. But beyond that, you decide:</p><ul><li>How the app is structured</li><li>How routing works</li><li>How data fetching works</li></ul><p>Here's a tiny React example:</p><pre class=\"code-block\"><code class=\"language-js\">import React from \"react\";\n\nfunction Greeting({ name }) {\n  return &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;\n}\n\nexport default Greeting;</code></pre><p>You call this component wherever you want. React doesn't dictate when or how you use it.</p><h3>Next.js: The Framework</h3><p>Next.js is a framework built on React. It handles routing, server-side rendering, static site generation, and more. It dictates certain patterns, like:</p><ul><li>File-based routing (pages/index.js becomes your homepage)</li><li>API routes (pages/api/)</li><li>Built-in optimizations (SSR, SSG, image optimization)</li></ul><p>A tiny Next.js page example:</p><pre class=\"code-block\"><code class=\"language-js\">// pages/index.js\nexport default function Home() {\n  return &lt;h1&gt;Welcome to my Next.js site!&lt;/h1&gt;;\n}</code></pre><p>Notice how you don't need to configure routing — Next.js handles it automatically. That's the framework \"calling your code,\" instead of you calling the library manually.</p><h2>Picking Between a Library and a Framework</h2><ul><li><strong>Project Complexity:</strong> Small or highly customized projects → library (React, Lodash); Larger projects with standard patterns → framework (Next.js, Angular, Django)</li><li><strong>Learning Curve:</strong> Libraries are easier to start with since they're more flexible; Frameworks have more conventions and rules but save time once you understand them.</li><li><strong>Community & Ecosystem:</strong> Both have huge communities, but frameworks often come with built-in tooling; Libraries might require piecing together multiple tools.</li></ul><h2>Code Snippets: Library vs Framework in Action</h2><h3>Using React (Library Approach)</h3><pre class=\"code-block\"><code class=\"language-jsx\">import React, { useEffect, useState } from \"react\";\n\nfunction UsersList() {\n  const [users, setUsers] = useState([]);\n\n  useEffect(() =&gt; {\n    fetch(\"https://jsonplaceholder.typicode.com/users\")\n      .then((res) =&gt; res.json())\n      .then(setUsers);\n  }, []);\n\n  return (\n    &lt;ul&gt;\n      {users.map((user) =&gt; (\n        &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;\n      ))}\n    &lt;/ul&gt;\n  );\n}\n\nexport default UsersList;</code></pre><p>You decide everything: how to fetch, where to store state, when to render.</p><h3>Using Next.js (Framework Approach)</h3><pre class=\"code-block\"><code class=\"language-js\">// pages/users.js\nexport async function getServerSideProps() {\n  const res = await fetch(\"https://jsonplaceholder.typicode.com/users\");\n  const users = await res.json();\n  return { props: { users } };\n}\n\nexport default function Users({ users }) {\n  return (\n    &lt;ul&gt;\n      {users.map((user) =&gt; (\n        &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;\n      ))}\n    &lt;/ul&gt;\n  );\n}</code></pre><p>Here, Next.js decides when and how to fetch data (server-side) and inject it into your page. You just provide the component logic. That's inversion of control in practice.</p><h2>Common Misconceptions</h2><ul><li>\"Libraries are always easier than frameworks\" → Not true. Libraries give flexibility, but you're responsible for app architecture.</li><li>\"Frameworks are restrictive\" → They're structured. That structure can save you time and prevent messy code in large apps.</li><li>\"React is a framework\" → Nope. React is a library; Next.js is a framework built on top of it.</li></ul><h2>Key Takeaways</h2><ul><li>Library = You call it. Flexibility.</li><li>Framework = It calls you. Structure.</li><li>React vs Next.js perfectly illustrates the difference.</li><li>Project choice matters — pick the right tool for the size and complexity of your app.</li><li>Understanding inversion of control will make your life easier when learning frameworks.</li></ul><p>Bottom Line: Knowing the difference between a library and a framework is more than a buzzword. It helps you structure projects correctly, pick the right tools, and avoid unnecessary frustration. Next time someone asks you this in an interview or a project, you'll answer like a pro.</p>"
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
        <div class="blog-card">
            <div class="blog-image">
                <img 
                    src="${getCorrectImagePath(blog.image || '')}" 
                    alt="${blog.alt || blog.title || 'Blog image'}" 
                    loading="lazy"
                    onerror="this.onerror=null; this.src='src/assets/profile-pic.png';"
                />
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${blog.category || 'General'}</span>
                    <span class="blog-date">${formatDate(blog.date)}</span>
                </div>
                <h3 class="blog-title">${blog.title || 'Untitled'}</h3>
                <p class="blog-description">${blog.summary || ''}</p>
                <div class="blog-footer">
                    <span class="blog-read-time">${blog.readTime || '5 min read'}</span>
                    <button class="blog-btn" onclick="openBlog(${blog.id})">Read More</button>
                </div>
            </div>
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
            "id": 1,
            "title": "AI explains Repo",
            "image": "src/assets/pro.png",
            "alt": "AI explains Repo Project",
            "github": "https://github.com/vikky2810/ai-explains-repo",
            "live": "https://ai-explains-repo.vercel.app/"
        },
        {
            "id": 2,
            "title": "Online Python code Editor",
            "image": "src/assets/project2.png",
            "alt": "python code editor",
            "github": "https://github.com/vikky2810/OnlineCodeEditor",
            "live": "https://viks-online-code-editor.vercel.app/"
        },
        {
            "id": 3,
            "title": "In Working..",
            "image": "src/assets/project-3.png",
            "alt": "Project in Development",
            "github": "https://github.com/",
            "live": "https://github.com/"
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
        <div class="details-container color-container project-card">
            <div class="project-image-container">
              <img
                src="${project.image || ''}"
                alt="${project.alt || project.title || 'Project image'}"
                class="project-img"
                loading="lazy"
                onerror="this.onerror=null; this.src='src/assets/project-1.png';"
              />
            </div>
            <div class="project-content">
              <h2 class="experience-sub-title project-title">${project.title || 'Untitled Project'}</h2>
              <div class="btn-container">
                <button
                  class="btn btn-color-2 project-btn" 
                  ${project.github ? '' : 'disabled="true"'}
                  ${project.github ? `onclick="window.open('${project.github}', '_blank')"` : ''}
                >
                  Github
                </button>
                <button
                  class="btn btn-color-2 project-btn" 
                  ${project.live ? '' : 'disabled="true"'}
                  ${project.live ? `onclick="window.open('${project.live}', '_blank')"` : ''}
                >
                  Live Demo
                </button>
              </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = cardsHtml || '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No projects to display yet.</p>';
}
  
