/**
 * Converts an absolute URL to a relative path
 * @param {string} url The URL to convert
 * @returns {string} The relative path
 */
function getRelativePath(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (error) {
      console.error(`Invalid URL: ${url}`, error);
      return url;
    }
  }
  return url;
}

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment (relative path or full URL)
 * @returns {Document} The document
 */
async function loadFragment(path) {
  if (path) {
    // Convert absolute URL to relative path to avoid CORS issues
    const relativePath = getRelativePath(path);
    
    if (relativePath.startsWith('/')) {
      try {
        const resp = await fetch(relativePath);
        if (resp.ok) {
          const parser = new DOMParser();
          return parser.parseFromString(await resp.text(), 'text/html');
        }
      } catch (error) {
        console.error(`Failed to load fragment from ${relativePath}:`, error);
      }
    }
  }
  return null;
}

/**
 * Retrieves the content of metadata tags.
 * @param {string} name The metadata name (or property)
 * @param doc Document object to query for the metadata. Defaults to the window's document
 * @returns {string} The metadata value(s)
 */
function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...doc.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(', ');
  return meta || '';
}

/**
 * Trims text to a specified number of words
 * @param {string} text The text to trim
 * @param {number} wordLimit The maximum number of words
 * @returns {string} The trimmed text
 */
function trimToWords(text, wordLimit = 20) {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
}

/**
 * Creates an article element for a bulletin
 * @param {string} path The bulletin path
 * @param {string} title The bulletin title
 * @param {string} description The bulletin description
 * @param {HTMLElement} image The bulletin image element
 * @returns {HTMLElement} The article element
 */
function createBulletinArticle(path, title, description, image) {
  const article = document.createElement('article');
  
  // Image section
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('bulletin-image');
  if (image) {
    imageDiv.appendChild(image.cloneNode(true));
  } else {
    // Create placeholder if no image
    const placeholder = document.createElement('div');
    placeholder.classList.add('bulletin-image-placeholder');
    placeholder.textContent = 'No Image';
    imageDiv.appendChild(placeholder);
  }
  
  // Content section
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('bulletin-content');
  
  const titleElement = document.createElement('h3');
  titleElement.classList.add('bulletin-title');
  titleElement.textContent = title || 'Untitled Bulletin';
  
  const descElement = document.createElement('p');
  descElement.classList.add('bulletin-description');
  descElement.textContent = trimToWords(description, 20);
  
  const linkDiv = document.createElement('div');
  linkDiv.classList.add('bulletin-link');
  const link = document.createElement('a');
  link.href = path;
  link.textContent = 'Show More';
  linkDiv.appendChild(link);
  
  contentDiv.appendChild(titleElement);
  contentDiv.appendChild(descElement);
  contentDiv.appendChild(linkDiv);
  
  article.appendChild(imageDiv);
  article.appendChild(contentDiv);
  
  return article;
}

/**
 * @param {HTMLElement} $block The recent-bulletins block element
 */
export default async function decorate($block) {
  // Get all links from the block
  const links = $block.querySelectorAll('a');
  const bulletinPaths = Array.from(links).map(link => link.getAttribute('href')).filter(href => href);
  
  // If no links found, try to get paths from text content
  if (bulletinPaths.length === 0) {
    const textContent = $block.textContent.trim();
    if (textContent) {
      // Split by newlines and filter out empty lines
      const paths = textContent.split('\n').map(line => line.trim()).filter(line => line && line.startsWith('/'));
      bulletinPaths.push(...paths);
    }
  }
  
  if (bulletinPaths.length === 0) {
    $block.innerHTML = '<p>No bulletins found.</p>';
    return;
  }
  
  // Create container for bulletins
  const container = document.createElement('div');
  container.classList.add('bulletins-container');
  
  // Load each bulletin and create article elements
  const bulletinPromises = bulletinPaths.map(async (path) => {
    const doc = await loadFragment(path);
    if (!doc) return null;
    
    // Extract metadata
    const title = getMetadata('og:title', doc) || doc.querySelector('title')?.textContent || '';
    const description = getMetadata('og:description', doc) || getMetadata('description', doc) || '';
    
    // Find image - try hero image first, then any image in main content
    let image = doc.querySelector('body > main picture');
    if (!image) {
      image = doc.querySelector('body > main img');
    }
    
    return createBulletinArticle(path, title, description, image);
  });
  
  // Wait for all bulletins to load and add them to container
  const bulletinArticles = await Promise.all(bulletinPromises);
  bulletinArticles.forEach(article => {
    if (article) {
      container.appendChild(article);
    }
  });
  
  // Replace block content with container
  $block.replaceChildren(container);
} 