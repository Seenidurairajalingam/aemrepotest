/* Column Item Block Decorator
 * Transforms authored column-item content (image + richtext) into a card structure.
 */

export default function decorate(block) {
  // Avoid double decoration
  if (block.classList.contains('column-card')) return;

  const card = document.createElement('div');
  card.className = 'column-card';
  card.setAttribute('data-aue-prop', 'card');
  card.setAttribute('data-aue-type', 'container');
  card.setAttribute('data-aue-label', 'Column Card');

  // Extract picture/img if present
  const picture = block.querySelector('picture, img');
  if (picture) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'column-card-media';
    imgWrapper.appendChild(picture);
    card.appendChild(imgWrapper);
  }

  // Content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'column-card-content';
  contentWrapper.setAttribute('data-aue-prop', 'content');
  contentWrapper.setAttribute('data-aue-type', 'richtext');
  contentWrapper.setAttribute('data-aue-label', 'Card Content');

  // Move remaining children (skip already moved picture)
  Array.from(block.children).forEach((child) => {
    if (child === picture?.parentElement || child === picture) return;
    if (/^H[1-6]$/.test(child.tagName)) {
      child.classList.add('column-card-title');
    } else if (child.tagName === 'P') {
      const link = child.querySelector('a');
      if (link) link.classList.add('column-card-cta');
      child.classList.add('column-card-text');
    }
    contentWrapper.appendChild(child);
  });

  card.appendChild(contentWrapper);

  // Replace original block contents
  block.innerHTML = '';
  block.appendChild(card);
}
