export default function decorate(block) {
  if (block.classList.contains('column-card-item-decorated')) return;
  block.classList.add('column-card-item-decorated');

  const card = document.createElement('div');
  card.className = 'column-card-item';

  const picture = block.querySelector('picture, img');
  if (picture) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'column-card-item-media';
    imgWrapper.appendChild(picture);
    card.appendChild(imgWrapper);
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'column-card-item-content';
}
