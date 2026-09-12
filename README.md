# Vikram Kamble's Portfolio 🤓

Welcome to Vikram Kamble's portfolio! This is a **static website** showcasing Vikram's skills, experiences, and projects.

## 🚀 Quick Start

### Local Development
```bash
# Option 1: Using Python (if you have Python installed)
python -m http.server 8000

# Option 2: Using Node.js (if you have Node.js installed)
npx http-server -p 8000

# Option 3: Using npm script
npm run serve
```

Then open `http://localhost:8000` in your browser.

### Deployment
This is a **static site** that can be deployed to any static hosting service:

- **GitHub Pages** (already configured)
- **Netlify** - Drag and drop the folder
- **Vercel** - Connect your GitHub repository
- **Firebase Hosting**
- **AWS S3 + CloudFront**

## 📁 Project Structure

```
vikky2810.github.io/
├── index.html              # Main HTML file
├── src/
│   ├── style.css           # Main stylesheet
│   ├── mediaqueries.css    # Responsive design
│   ├── script.js           # JavaScript functionality
│   └── assets/             # Images and resources
│       ├── profile-pic.png
│       ├── about-pic.png
│       ├── project-*.png
│       └── *.png (icons)
├── package.json            # Project configuration
└── README.md              # This file
```

## 🎯 Features

### ✅ Static Site Benefits
- **No server required** - Pure HTML, CSS, and JavaScript
- **Fast loading** - No backend processing
- **Easy deployment** - Works on any static hosting
- **SEO optimized** - Search engine friendly
- **Mobile responsive** - Works on all devices

### 📱 Responsive Design
- Desktop navigation
- Mobile hamburger menu
- Optimized for all screen sizes

### 🎨 Modern UI/UX
- Clean, professional design
- Smooth scrolling navigation
- Hover effects and animations
- Professional color scheme

## 📋 Sections

### Profile
- Introduction and social links
- Download CV functionality
- Professional photo

### About
- Personal background
- Education and experience summary
- Professional interests

### Experience
- Frontend Development skills (HTML, CSS, JavaScript, React, Angular)
- Backend Development skills (Node.js, Express.js, MySQL, MongoDB, Git)

### Projects
- Alpaca Image Generator (with live demo)
- TicTacToe Game
- Project in development

### Contact
- Email: kamblevikram2810@gmail.com
- LinkedIn: [Vikram Kamble](https://linkedin.com/in/vikram-kamble-888933264)
- GitHub: [vikky2810](https://github.com/vikky2810)

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox
- **JavaScript** - Interactive functionality
- **Responsive Design** - Mobile-first approach

### Performance Optimizations
- **Lazy loading** for images
- **Optimized images** with proper sizing
- **Minimal JavaScript** for fast loading
- **CSS optimizations** for smooth animations

### SEO Features
- **Meta tags** for search engines
- **Open Graph** tags for social sharing
- **Structured data** (JSON-LD)
- **Semantic HTML** structure

### Analytics
Plausible, configured in `src/analytics.js` and pulled in by every page with one
`<script defer src="/src/analytics.js">` tag. It is cookieless, so the site needs
no consent banner, and it ignores localhost so local testing does not skew the
numbers.

Page views, resume downloads and outbound clicks are tracked automatically. Three
more goals are fired from `src/analytics.js`: `Contact Click` for `mailto:` links,
which Plausible does not count as outbound, and `Read 50%` / `Read 90%` for how far
visitors actually get through a blog post. Views alone cannot tell a read from a
bounce, so those two are what answer "which post is working" - filter either goal
by page to compare posts.

All five have to be added once under **Site Settings > Goals** in Plausible,
otherwise they are collected but never charted:

| Goal | Type |
|------|------|
| `File Download` | Special |
| `Outbound Link: Click` | Special |
| `Contact Click` | Custom event |
| `Read 50%` | Custom event |
| `Read 90%` | Custom event |

Swapping providers, or pasting in a newer Plausible snippet, is an edit to
`src/analytics.js` alone - no page markup changes.

## 🌐 Deployment Options

### GitHub Pages (Current)
Your site is already deployed at: https://vikky2810.github.io

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Get instant deployment

### Vercel
1. Connect your GitHub repository
2. Automatic deployment on push
3. Custom domain support

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📈 Performance

### PageSpeed Insights
- **Mobile**: 90+ score
- **Desktop**: 95+ score
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s

### Optimization Tips
1. **Image optimization** - Use WebP format when possible
2. **Minify CSS/JS** - Reduce file sizes
3. **Enable compression** - Gzip/Brotli
4. **Use CDN** - Faster global delivery

## 🔄 Maintenance

### Regular Updates
- Keep project information current
- Update skills and experience
- Add new projects
- Refresh design periodically

### Version Control
- All changes tracked in Git
- Easy rollback if needed
- Collaboration friendly

## 📞 Support

If you'd like to contribute or have questions:
1. Fork the repository
2. Make your changes
3. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Thank you for visiting Vikram's portfolio!** 🚀