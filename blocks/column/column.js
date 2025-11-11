/* Column Block
 * Supports 2 or 3 column card layouts (desktop) collapsing to 1 column (mobile).
 * Authoring: optional first cell as variation selector ("2" or "3").
 * Legacy: if no variation cell, infer by number of direct child items (2 or 3).
 */

export default function decorate(block) {
  // Collect raw children (initial raw children may include variation selector)
  const children = Array.from(block.children);

  let variationDiv;
  let itemDivs = children;

  // Authoring structure: support multiple ways editors may provide a variation value.
  // 1) explicit first cell with "2" or "3" (legacy)
  // 2) an authored element with data-aue-prop="columns" or data-aue-prop="variation"
  if (children.length > 0) {
    const firstText = children[0].textContent && children[0].textContent.trim();
    if (firstText && /^[23]$/.test(firstText)) {
      [variationDiv] = children; // destructure first element
      itemDivs = children.slice(1);
    } else {
      // look for explicit authored variation element (data attributes produced by the editor)
      const authored = children.find((c) => c.getAttribute && (c.getAttribute('data-aue-prop') === 'columns' || c.getAttribute('data-aue-prop') === 'variation'));
      if (authored) {
        variationDiv = authored;
        itemDivs = children.filter((c) => c !== authored);
      }
    }
  }

  // Infer columns: prefer authored value, else number of itemDivs, clamp between 2 and 3
  let cols = itemDivs.length;
  if (variationDiv) {
    const authoredCols = parseInt(variationDiv.textContent.trim(), 10);
    if ([2, 3].includes(authoredCols)) {
      cols = authoredCols;
    }
  }
  if (![2, 3].includes(cols)) {
    cols = Math.min(Math.max(itemDivs.length, 2), 3);
  }

  block.classList.add('column-block');
  block.classList.add(`column-${cols}-cols`);
  block.setAttribute('data-cols', cols);

  // Prepare container wrapper for grid
  const grid = document.createElement('div');
  grid.className = 'column-grid';

  // Preserve hidden variation field for Universal Editor roundtrip
  if (variationDiv) {
    const hiddenVar = document.createElement('div');
    hiddenVar.className = 'column-variation';
    hiddenVar.textContent = `${cols}`;
    hiddenVar.style.display = 'none';
    // preserve original authored prop name when possible
    const propName = variationDiv.getAttribute && variationDiv.getAttribute('data-aue-prop') ? variationDiv.getAttribute('data-aue-prop') : 'columns';
    hiddenVar.setAttribute('data-aue-prop', propName);
    hiddenVar.setAttribute('data-aue-label', 'Number of Columns');
    hiddenVar.setAttribute('data-aue-type', 'select');
    block.prepend(hiddenVar);
  }

  // Clear block (retain hidden variation if added)
  itemDivs.forEach((d) => d.remove());

  // Build each column card
  itemDivs.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'column-card';

    // Authoring attributes
    card.setAttribute('data-aue-prop', 'card');
    card.setAttribute('data-aue-type', 'container');
    card.setAttribute('data-aue-label', 'Column Card');

    // Detect image (picture/img) and wrap
    const picture = item.querySelector('picture, img');
    if (picture) {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'column-card-media';
      imgWrapper.appendChild(picture);
      card.appendChild(imgWrapper);
    }

    // Text content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'column-card-content';
    contentWrapper.setAttribute('data-aue-prop', 'content');
    contentWrapper.setAttribute('data-aue-type', 'richtext');
    contentWrapper.setAttribute('data-aue-label', 'Card Content');

    const authoredContent = item.querySelector('[data-aue-prop="text"], [data-aue-prop="content"]');
    if (authoredContent) {
      Array.from(authoredContent.childNodes).forEach((n) => contentWrapper.appendChild(n));
    } else {
      // Move remaining children (headings, paragraphs, links) into content
      Array.from(item.children).forEach((child) => {
        // Normalize headings
        if (/^H[1-6]$/.test(child.tagName)) {
          child.classList.add('column-card-title');
        } else if (child.tagName === 'P') {
          const link = child.querySelector('a');
          if (link) {
            link.classList.add('column-card-cta');
          }
          child.classList.add('column-card-text');
        }
        contentWrapper.appendChild(child);
      });
    }

    card.appendChild(contentWrapper);
    grid.appendChild(card);
  });

  block.appendChild(grid);
}
