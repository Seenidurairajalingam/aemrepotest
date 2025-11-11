export default function decorate(block) {
  // Destructure the expected child divs
  const [
    textDiv,
    buttonOneLabelDiv,
    buttonOneLinkDiv,
    openInNewTabDiv,
    buttonTwoLabelDiv,
    buttonTwoLinkDiv,
    openInNewTabTwoDiv,
  ] = block.children;

  // Clear existing block content before rebuilding
  block.textContent = '';

  // TEXT SECTION
  const textWrapper = document.createElement('div');
  textWrapper.classList.add('text-with-button__text');

  if (textDiv) {
    const innerContent = textDiv.querySelector('div');
    if (innerContent) {
      textWrapper.innerHTML = innerContent.innerHTML.trim();
    }
  }

  block.appendChild(textWrapper);

  // BUTTON SECTION
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('text-with-button__buttons');

  // Helper to create a button div with aria attributes
  const createButton = (labelEl, linkEl, openInNewTabEl) => {
    const label = labelEl?.querySelector('p')?.textContent?.trim();
    const link = linkEl?.querySelector('a')?.getAttribute('href');
    const openInNewTab = openInNewTabEl?.querySelector('p')?.textContent?.trim().toLowerCase() === 'true';

    if (label && link) {
      const buttonDiv = document.createElement('div');
      buttonDiv.classList.add('text-with-button__button');

      const button = document.createElement('a');
      button.href = link;
      button.textContent = label;
      button.classList.add('button');
      button.setAttribute('aria-label', label);
      button.setAttribute('role', 'button');

      // Add target and rel if openInNewTab is true
      if (openInNewTab) {
        button.setAttribute('target', '_blank');
        button.setAttribute('rel', 'noopener noreferrer');
      } else {
        button.setAttribute('target', '_self');
      }

      buttonDiv.appendChild(button);
      return buttonDiv;
    }
    return null;
  };

  // Create both buttons if available
  const buttonOne = createButton(buttonOneLabelDiv, buttonOneLinkDiv, openInNewTabDiv);
  const buttonTwo = createButton(buttonTwoLabelDiv, buttonTwoLinkDiv, openInNewTabTwoDiv);

  if (buttonOne) buttonsWrapper.appendChild(buttonOne);
  if (buttonTwo) buttonsWrapper.appendChild(buttonTwo);

  // Append buttons section only if it has buttons
  if (buttonsWrapper.children.length > 0) {
    block.appendChild(buttonsWrapper);
  }
}
