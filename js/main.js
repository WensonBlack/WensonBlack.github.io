// ============================================
// PERSONAL BLOG - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initModal();
  loadContent();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// MODAL/LIGHTBOX
// ============================================
function initModal() {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.querySelector('.modal-close');

  const closeModal = () => {
    modal?.classList.remove('active');
    modalContent.innerHTML = '';
  };

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  window.openModal = (content) => {
    modalContent.innerHTML = content;
    modal?.classList.add('active');
  };
}

// ============================================
// CONTENT LOADING
// ============================================
async function loadContent() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (currentPage === 'index.html' || currentPage === '' || currentPage === 'posts.html') {
    loadBlogPosts();
  } else if (currentPage === 'post.html') {
    loadSinglePost();
  }
}

// ============================================
// BLOG POSTS (Homepage)
// ============================================
async function loadBlogPosts() {
  try {
    const response = await fetch('posts.json');
    const data = await response.json();

    const container = document.getElementById('blog-posts');
    if (container) {
      container.innerHTML = data.posts.map(post => createPostCard(post)).join('');

      // Re-initialize scroll animations for the newly added posts
      initScrollAnimations();
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
}

function createPostCard(post) {
  // Get the first image from post content for thumbnail
  const firstImage = post.content.find(item => item.type === 'image');
  const thumbnail = firstImage ? firstImage.url : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop';

  return `
    <article class="card scroll-reveal">
      <img src="${thumbnail}" alt="${post.title}" class="card-image" loading="lazy">
      <div>
        <h3 class="card-title">${post.title}</h3>
        <div class="card-meta">${formatDate(post.date)} • ${post.author}</div>
        <p class="card-content">${post.excerpt}</p>
        <div class="card-tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <a href="post.html?slug=${post.slug}" class="btn btn-secondary" style="margin-top: var(--spacing-lg); width: 100%;">Read More</a>
      </div>
    </article>
  `;
}

// ============================================
// SINGLE POST PAGE
// ============================================
async function loadSinglePost() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
      window.location.href = 'index.html';
      return;
    }

    const response = await fetch('posts.json');
    const data = await response.json();
    const post = data.posts.find(p => p.slug === slug);

    if (!post) {
      window.location.href = 'index.html';
      return;
    }

    // Update page title
    document.getElementById('post-title').textContent = `${post.title} - NOSNEW`;

    // Render post header
    const headerContainer = document.getElementById('post-header');
    headerContainer.innerHTML = `
      <h1 style="font-size: var(--font-size-5xl); margin-bottom: var(--spacing-md);">${post.title}</h1>
      <div style="color: var(--color-gray-600); font-size: var(--font-size-lg); margin-bottom: var(--spacing-3xl);">
        ${formatDate(post.date)} • ${post.author}
      </div>
    `;

    // Render post content
    const contentContainer = document.getElementById('post-content');
    contentContainer.innerHTML = post.content.map(item => renderContentItem(item)).join('');

    // Render post footer with tags
    const footerContainer = document.getElementById('post-footer');
    footerContainer.innerHTML = `
      <div style="margin-top: var(--spacing-3xl); padding-top: var(--spacing-xl); border-top: 1px solid var(--color-gray-200);">
        <div style="display: flex; gap: var(--spacing-xs); flex-wrap: wrap;">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;

    // Load related posts
    const relatedPosts = data.posts.filter(p => p.id !== post.id).slice(0, 3);
    const relatedContainer = document.getElementById('related-posts');
    const relatedSection = relatedContainer?.closest('section');

    if (relatedPosts.length > 0) {
      if (relatedContainer) {
        relatedContainer.innerHTML = relatedPosts.map(p => createPostCard(p)).join('');
        initScrollAnimations();
      }
      if (relatedSection) relatedSection.style.display = 'block';
    } else {
      if (relatedSection) relatedSection.style.display = 'none';
    }

    // Attach event listeners for images and videos
    attachMediaListeners();

  } catch (error) {
    console.error('Error loading post:', error);
    window.location.href = 'index.html';
  }
}

function renderContentItem(item) {
  switch (item.type) {
    case 'text':
      return `<p style="font-size: var(--font-size-lg); line-height: 1.8; color: var(--color-gray-700); margin-bottom: var(--spacing-xl); white-space: pre-line;">${item.content}</p>`;

    case 'image':
      return `
        <figure style="margin: var(--spacing-2xl) 0;">
          <img 
            src="${item.url}" 
            alt="${item.alt || item.caption}" 
            style="width: 100%; border-radius: var(--radius-lg); cursor: pointer;"
            class="post-image"
            data-url="${item.url}"
            loading="lazy"
          >
          ${item.caption ? `<figcaption style="text-align: center; color: var(--color-gray-600); font-size: var(--font-size-sm); margin-top: var(--spacing-md);">${item.caption}</figcaption>` : ''}
        </figure>
      `;

    case 'video':
      const videoId = extractYouTubeId(item.url);
      return `
        <figure style="margin: var(--spacing-2xl) 0;">
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-lg);">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              frameborder="0" 
              allowfullscreen
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            ></iframe>
          </div>
          ${item.caption ? `<figcaption style="text-align: center; color: var(--color-gray-600); font-size: var(--font-size-sm); margin-top: var(--spacing-md);">${item.caption}</figcaption>` : ''}
        </figure>
      `;

    default:
      return '';
  }
}

function attachMediaListeners() {
  // Image click to open in lightbox
  document.querySelectorAll('.post-image').forEach(img => {
    img.addEventListener('click', () => {
      const url = img.dataset.url;
      const caption = img.alt;
      openModal(`
        <img src="${url}" alt="${caption}" style="max-width: 100%; max-height: 90vh; border-radius: var(--radius-lg);">
        ${caption ? `<p style="color: white; text-align: center; margin-top: 1rem;">${caption}</p>` : ''}
      `);
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
