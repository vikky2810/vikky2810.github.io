# Blog Management Guide

## How to Add New Blogs

Your blog section is now powered by a JSON file, making it super easy to add new blog posts!

### 📁 File Location
All blog data is stored in: `src/blogs.json`

### ➕ Adding a New Blog

1. Open `src/blogs.json`
2. Add a new blog object to the `blogs` array
3. Follow this structure:

```json
{
  "id": 4,
  "title": "Your Blog Title Here",
  "description": "A brief description of your blog post. This will be shown on the card preview...",
  "image": "src/assets/your-image.png",
  "alt": "Image description for accessibility",
  "date": "2024-01-20",
  "readTime": "10 min read",
  "category": "Technology",
  "url": "https://your-blog-url.com"
}
```

### 📋 Required Fields

- **id**: Unique number (increment from the last blog)
- **title**: Blog post title
- **description**: Brief description (will be truncated in preview)
- **image**: Path to your blog image
- **alt**: Alt text for accessibility
- **date**: Publication date (YYYY-MM-DD format)
- **readTime**: Estimated reading time
- **category**: Blog category (e.g., "Technology", "Tutorial", "Review")
- **url**: Link to the full blog post (use "#" if not ready)

### 🎨 Features

- **Automatic Sorting**: Blogs are automatically sorted by date (newest first)
- **Recent Display**: Only the 3 most recent blogs are shown
- **Responsive Design**: Works on all screen sizes
- **Category Tags**: Each blog shows a colored category tag
- **Read Time**: Shows estimated reading time
- **Date Display**: Shows formatted publication date

### 🖼️ Adding Images

1. Place your blog images in `src/assets/`
2. Use the path: `src/assets/your-image.png`
3. Recommended size: 400x200px for best display

### 🔄 How It Works

The website automatically:
1. Loads blog data from `blogs.json`
2. Sorts blogs by date (newest first)
3. Displays the 3 most recent blogs
4. Renders them with proper styling and interactions

## 📝 Creating New Blog Posts

### Step 1: Create the Blog HTML File
1. Copy `src/blog/blog-template.html`
2. Rename it to something descriptive (e.g., `my-new-blog.html`)
3. Edit the content inside the template

### Step 2: Update the Template
Replace these placeholders in your new blog file:
- `BLOG_TITLE` → Your actual blog title
- `PUBLISH_DATE` → Publication date (e.g., "January 20, 2025")
- `READ_TIME` → Estimated reading time (e.g., "10 min read")
- `CATEGORY` → Blog category (e.g., "Technology")

### Step 3: Add Your Content
- Write your blog content in the `.blog-content` section
- Use the provided CSS classes for styling:
  - `<h2>` for main sections
  - `<h3>` for subsections
  - `.code-block` for code examples
  - `.warning`, `.info`, `.success` for callout boxes

### Step 4: Update JSON File
Add your new blog to `src/blogs.json`:
```json
{
  "id": 4,
  "title": "Your Blog Title",
  "description": "Brief description...",
  "image": "src/assets/your-image.png",
  "alt": "Image description",
  "date": "2025-01-20",
  "readTime": "10 min read",
  "category": "Technology",
  "url": "src/blog/your-blog-file.html"
}
```

### 💡 Tips

- Keep descriptions under 150 characters for best display
- Use descriptive alt text for accessibility
- Update the date when you publish
- Use consistent categories for better organization
- Test your blog URLs before publishing
- Use the template for consistent styling
- Add images to `src/assets/` folder

### 🎨 Available Styling Classes

- **Code blocks**: Use `.code-block` with `<pre>` tags
- **Warning boxes**: Use `.warning` class
- **Info boxes**: Use `.info` class  
- **Success boxes**: Use `.success` class
- **Lists**: Use standard `<ul>` and `<ol>` tags

That's it! Create your HTML file, update the JSON, and your new blog will appear automatically! 🚀
