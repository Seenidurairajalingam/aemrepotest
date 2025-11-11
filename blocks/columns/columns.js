export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`, 'column-layout-block');

  [...block.children].forEach((row) => {
    row.classList.add('column-layout-row');
    [...row.children].forEach((col) => {
      const picturetag = col.querySelector('p picture');
      const isPromotional = block.classList.contains('promotional-layout');

      let bgImageUrl = '';
      const textWrapper = document.createElement('div');

      if (picturetag) {
        const img = picturetag.querySelector('img');
        if (img && img.src) {
          bgImageUrl = img.src;
        }
      }
      if (picturetag && !isPromotional) {
        const pTag = picturetag.closest('p');

        const newPicture = document.createElement('picture');
        picturetag.querySelectorAll('source').forEach((src) => {
          newPicture.appendChild(src.cloneNode(true));
        });
        const img = picturetag.querySelector('img');
        if (img) {
          if (!img.alt) img.alt = '';
          newPicture.appendChild(img.cloneNode(true));
        }

        const picWrapper = newPicture.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('columns-img');
        imgDiv.appendChild(newPicture);

        if (block.classList.contains('popular-brands')) {
          const siblingAnchor = col.querySelector('a[href]');
          if (siblingAnchor && newPicture) {
            const href = siblingAnchor.getAttribute('href');
            const anchorWrap = document.createElement('a');
            anchorWrap.href = href;

            anchorWrap.appendChild(newPicture.cloneNode(true));
            imgDiv.innerHTML = '';
            imgDiv.appendChild(anchorWrap);
          }
        }

        pTag.replaceWith(imgDiv);
      } else if (isPromotional && picturetag.querySelector('img')) {
        col.style.backgroundImage = `url(${bgImageUrl})`;
        col.style.backgroundSize = 'cover';
        col.style.backgroundPosition = 'center';
        col.classList.add('has-background');
        const pTag = picturetag.closest('p');
        if (pTag) pTag.remove();
      }

      const errorImg = col.querySelectorAll('img[src="about:error"]');
      errorImg.forEach((img) => img.closest('p').remove());

      // Step 3: Normalize text paragraphs
      textWrapper.classList.add('columns-text');
      const textTitle = [...col.querySelectorAll('h4, h3, h2, h1')];
      const textParas = [...col.querySelectorAll('p')];
      if (textParas.length) {
        textParas.forEach((p) => {
          if (!p.querySelector('img')) {
            p.innerHTML = p.innerHTML.trim();
            textWrapper.appendChild(p);
          }
        });
      }
      if (textTitle.length) {
        textTitle.forEach((title) => {
          title.removeAttribute('id');
          title.classList.add('columns-title');
          title.innerHTML = title.innerHTML.trim();
          textWrapper.appendChild(title);
        });
      }

      col.appendChild(textWrapper);
      if (!isPromotional) {
        const buttonLinks = col.querySelectorAll('p.button-container a.button');
        buttonLinks.forEach((a) => {
          a.classList.remove('button');
        });
      }
    });
  });
}
