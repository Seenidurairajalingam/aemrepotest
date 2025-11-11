export default function decorate(block) {
  // Handle both 2-field (legacy) and 3-field (new) structures
  let variationDiv;
  let imageDiv;
  let textDiv;

  if (block.children.length === 3) {
    // New 3-field structure: variation, image, text
    [variationDiv, imageDiv, textDiv] = block.children;
  } else {
    // Legacy 2-field structure: image, text
    [imageDiv, textDiv] = block.children;
  }

  if (!imageDiv || !textDiv) {
    console.warn('Text-with-image block requires both image and text sections');
    return;
  }

  // Get variation from authored content or fallback to CSS classes
  let variation = 'overlay-right'; // default

  if (variationDiv) {
    // Get variation from authored field
    const variationText = variationDiv.textContent.trim();
    if (['overlay-left', 'side-by-side-left', 'side-by-side-right', 'text-below'].includes(variationText)) {
      variation = variationText;
    }
  } else {
    // Fallback to CSS classes for backward compatibility
    const blockClasses = Array.from(block.classList);
    if (blockClasses.includes('overlay-left')) {
      variation = 'overlay-left';
    } else if (blockClasses.includes('side-by-side-left')) {
      variation = 'side-by-side-left';
    } else if (blockClasses.includes('side-by-side-right')) {
      variation = 'side-by-side-right';
    } else if (blockClasses.includes('text-below')) {
      variation = 'text-below';
    }
  }

  // Clear the block and add our structure
  block.innerHTML = '';
  block.setAttribute('data-variation', variation);

  // Create container
  const container = document.createElement('div');
  container.className = `text-with-image-container text-with-image-${variation}`;

  // Preserve variation field for authoring if it exists
  if (variationDiv) {
    const variationField = document.createElement('div');
    variationField.className = 'text-with-image-variation';
    variationField.textContent = variation;
    variationField.style.display = 'none'; // Hidden from display but available for authoring
    variationField.setAttribute('data-aue-prop', 'variation');
    variationField.setAttribute('data-aue-label', 'Layout Variation');
    variationField.setAttribute('data-aue-type', 'select');
    container.appendChild(variationField);
  }

  // Process image
  const imageSection = document.createElement('div');
  imageSection.className = 'text-with-image-image';

  // Add authoring attributes for image
  imageSection.setAttribute('data-aue-prop', 'image');
  imageSection.setAttribute('data-aue-label', 'Background Image');
  imageSection.setAttribute('data-aue-type', 'media');

  const img = imageDiv.querySelector('img');
  if (img) {
    // Ensure image is responsive
    img.setAttribute('loading', 'lazy');
    imageSection.appendChild(img);
  }

  // Process text content
  const textSection = document.createElement('div');
  textSection.className = 'text-with-image-text';

  // Move all text content to text section
  const textContent = document.createElement('div');
  textContent.className = 'text-with-image-content';

  // Create the nested div structure for authoring (only for overlay variations)
  if (variation.includes('overlay')) {
    const outerDiv = document.createElement('div');
    const paragraphWrapper = document.createElement('p');
    const innerDiv = document.createElement('div');

    // Add data attributes for authoring
    innerDiv.setAttribute('data-aue-prop', 'text');
    innerDiv.setAttribute('data-aue-label', 'Text Content');
    innerDiv.setAttribute('data-aue-filter', 'text');
    innerDiv.setAttribute('data-aue-type', 'richtext');

    // Process the text elements
    const textElements = Array.from(textDiv.children);
    textElements.forEach((element) => {
      processTextElement(element, innerDiv);
    });

    // Build the nested structure for overlay
    paragraphWrapper.appendChild(innerDiv);
    outerDiv.appendChild(paragraphWrapper);
    textContent.appendChild(outerDiv);
  } else {
    // For non-overlay variations, use simpler structure
    const textElements = Array.from(textDiv.children);
    textElements.forEach((element) => {
      processTextElement(element, textContent);
    });
  }

  textSection.appendChild(textContent);

  // Add sections to container based on variation
  if (variation === 'side-by-side-right' || variation === 'overlay-left') {
    container.appendChild(textSection);
    container.appendChild(imageSection);
  } else {
    container.appendChild(imageSection);
    container.appendChild(textSection);
  }

  // Add container to block
  block.appendChild(container);
}

// Helper function to process text elements
function processTextElement(element, parentElement) {
  if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4') {
    element.className = 'text-with-image-title';
  } else if (element.tagName === 'P') {
    // Check if paragraph contains a link (CTA)
    const link = element.querySelector('a');
    if (link) {
      // This is a CTA paragraph
      element.className = 'button-container';
      link.className = 'text-with-image-cta button';
    } else {
      // Regular description paragraph
      element.className = 'text-with-image-description';
    }
  } else if (element.tagName === 'A') {
    // Standalone link - wrap in button container
    const buttonContainer = document.createElement('p');
    buttonContainer.className = 'button-container';
    element.className = 'text-with-image-cta button';
    buttonContainer.appendChild(element);
    parentElement.appendChild(buttonContainer);
    return;
  }

  parentElement.appendChild(element);
}
