export default function decorate(block) {
  block.classList.add('column-layout-decorated');

  const wrapper = block.firstElementChild;
  if (!wrapper) return;

  const cols = [...wrapper.children];
  block.classList.add(`columns-${cols.length}-cols`);
}
