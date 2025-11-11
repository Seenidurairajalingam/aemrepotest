export default function decorate(block) {
  // Expect optional first column to contain the variation value coming from the select field
  // Valid options per model: leftAligned, centerAligned
  const VALID_VARIATIONS = ['leftAligned', 'centerAligned'];

  let variation = 'leftAligned';
  const children = Array.from(block.children);

  if (children.length > 0) {
    const maybeVariationDiv = children[0];
    const authoredValue = (maybeVariationDiv.textContent || '').trim();
    if (VALID_VARIATIONS.includes(authoredValue)) {
      variation = authoredValue;
    }
    const buttonValue = children[children.length - 1].querySelector('a').getAttribute('data-link-type');
    console.log("testing button value");
    console.log(buttonValue);
  }

  // Apply class and data attribute to the root block for styling hooks
  block.dataset.variation = variation;
  block.classList.add(`hero-banner--${variation}`);
  block.classList.add(buttonClassValue);

  // Preserve variation for in-context editing, but hide from visual output
  // If an authored variation cell exists, keep it but hide; otherwise create one so authoring works
  let variationField = children[0];
  if (!variationField || !VALID_VARIATIONS.includes((variationField.textContent || '').trim())) {
    variationField = document.createElement('div');
    variationField.textContent = variation;
    block.insertBefore(variationField, block.firstChild);
  }
  variationField.style.display = 'none';
  variationField.setAttribute('data-aue-prop', 'variation');
  variationField.setAttribute('data-aue-label', 'Banner Variation');
  variationField.setAttribute('data-aue-type', 'select');
}
