# Personal Blog

A minimalist personal blog with black and white aesthetic where you can write posts containing text, images, and videos.

🌐 **Live Site**: [nosnew.com](https://nosnew.com)

## Features

- ✨ Clean black & white minimalist design
- 📝 Blog posts with mixed content (text, images, videos)
- 📱 Fully responsive design
- 🎨 Smooth animations and transitions
- 🖼️ Image lightbox viewer
- 🎬 Embedded video support (YouTube)

## Local Development

Start a local server to preview the blog:

```bash
python3 -m http.server 8000
```

Then open your browser to `http://localhost:8000`

## Adding a New Blog Post

Edit `posts.json` and add a new entry to the `posts` array:

```json
{
  "id": 6,
  "title": "Your Post Title",
  "slug": "your-post-title",
  "date": "2026-01-28",
  "author": "Wenson",
  "excerpt": "Brief description of your post...",
  "featured": true,
  "content": [
    {
      "type": "text",
      "content": "Your paragraph text here..."
    },
    {
      "type": "image",
      "url": "https://images.unsplash.com/photo-xxx",
      "caption": "Image caption",
      "alt": "Image alt text"
    },
    {
      "type": "video",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "thumbnail": "https://images.unsplash.com/photo-xxx",
      "caption": "Video caption"
    }
  ],
  "tags": ["Tag1", "Tag2", "Tag3"]
}
```

### Content Types

Each blog post can contain multiple content blocks:

**Text Block:**
```json
{
  "type": "text",
  "content": "Your text here. You can use \\n for line breaks."
}
```

**Image Block:**
```json
{
  "type": "image",
  "url": "https://example.com/image.jpg",
  "caption": "Optional caption",
  "alt": "Alt text for accessibility"
}
```

**Video Block (YouTube):**
```json
{
  "type": "video",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "caption": "Optional caption"
}
```

## Deployment

The blog is automatically deployed to GitHub Pages when you push to the `master` branch:

```bash
git add .
git commit -m "Add new blog post"
git push origin master
```

Your changes will be live at **nosnew.com** within 1-2 minutes.

## Project Structure

```
.
├── index.html          # Homepage with blog posts
├── post.html           # Individual blog post page
├── about.html          # About page
├── posts.json          # All blog posts content
├── css/
│   └── style.css      # All styles
├── js/
│   └── main.js        # JavaScript functionality
└── CNAME              # Custom domain config
```

## Customization

### Site Name

Update "NOSNEW" in all HTML files to your preferred site name.

### Colors

Edit CSS custom properties in `css/style.css`:

```css
:root {
  --color-black: #000000;
  --color-white: #ffffff;
  /* Customize as needed */
}
```

### Typography

Change the font by updating the Google Fonts import in `css/style.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;700&display=swap');
```

## Image Sources

Sample images are from [Unsplash](https://unsplash.com). Replace with your own images by updating the URLs in `posts.json`.

## Tips for Writing Posts

1. **Keep it simple** - The minimalist design works best with focused content
2. **Use high-quality images** - Images from Unsplash work great
3. **Mix content types** - Combine text, images, and videos for engaging posts
4. **Write clear excerpts** - These appear on the homepage
5. **Use descriptive slugs** - URLs will be `post.html?slug=your-slug`

---

Built with ❤️ using HTML, CSS, and JavaScript
