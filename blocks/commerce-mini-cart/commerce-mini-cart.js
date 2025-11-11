import { render as provider } from '@dropins/storefront-cart/render.js';
import MiniCart from '@dropins/storefront-cart/containers/MiniCart.js';
import { events } from '@dropins/tools/event-bus.js';
import { tryRenderAemAssetsImage } from '@dropins/tools/lib/aem/assets.js';

// Initializers
import '../../scripts/initializers/cart.js';

import { readBlockConfig } from '../../scripts/aem.js';
import { fetchPlaceholders, rootLink } from '../../scripts/commerce.js';

export default async function decorate(block) {
  const {
    'start-shopping-url': startShoppingURL = '',
    'cart-url': cartURL = '',
    'checkout-url': checkoutURL = '',
  // 'enable-updating-product': enableUpdatingProduct = 'false', // removed unused variable
  } = readBlockConfig(block);

  // Get translations for custom messages
  const placeholders = await fetchPlaceholders();

  const MESSAGES = {
    ADDED: placeholders?.Global?.MiniCartAddedMessage,
    UPDATED: placeholders?.Global?.MiniCartUpdatedMessage,
  };

  // Create a container for the update message
  const updateMessage = document.createElement('div');
  updateMessage.className = 'commerce-mini-cart__update-message';

  // Create shadow wrapper
  const shadowWrapper = document.createElement('div');
  shadowWrapper.className = 'commerce-mini-cart__message-wrapper';
  shadowWrapper.appendChild(updateMessage);

  const showMessage = (message) => {
    updateMessage.textContent = message;
    updateMessage.classList.add('commerce-mini-cart__update-message--visible');
    shadowWrapper.classList.add('commerce-mini-cart__message-wrapper--visible');
    setTimeout(() => {
      updateMessage.classList.remove(
        'commerce-mini-cart__update-message--visible',
      );
      shadowWrapper.classList.remove(
        'commerce-mini-cart__message-wrapper--visible',
      );
    }, 3000);
  };

  // Add event listeners for cart updates
  events.on('cart/product/added', () => showMessage(MESSAGES.ADDED), {
    eager: true,
  });
  events.on('cart/product/updated', () => showMessage(MESSAGES.UPDATED), {
    eager: true,
  });

  block.innerHTML = '';
  block.classList.add('commerce-mini-cart');

  // Render MiniCart first
  const getProductLink = (product) => rootLink(`/products/${product.url.urlKey}/${product.topLevelSku}`);
  await provider.render(MiniCart, {
    routeEmptyCartCTA: startShoppingURL ? () => rootLink(startShoppingURL) : undefined,
    routeCart: cartURL ? () => rootLink(cartURL) : undefined,
    routeCheckout: checkoutURL ? () => rootLink(checkoutURL) : undefined,
    routeProduct: getProductLink,

    slots: {
      Thumbnail: (ctx) => {
        const { item, defaultImageProps } = ctx;
        const anchorWrapper = document.createElement('a');
        anchorWrapper.href = getProductLink(item);

        tryRenderAemAssetsImage(ctx, {
          alias: item.sku,
          imageProps: defaultImageProps,
          wrapper: anchorWrapper,
          params: {
            width: defaultImageProps.width,
            height: defaultImageProps.height,
          },
        });

        // Custom Quantity Incrementer DOM
        const incrementer = document.createElement('div');
        incrementer.className = 'dropin-incrementer dropin-incrementer--medium dropin-cart-item__quantity__incrementer';

        const incrementerContent = document.createElement('div');
        incrementerContent.className = 'dropin-incrementer__content dropin-incrementer__content--medium';

        // Track quantity locally for UI updates
        let currentQty = item.quantity;

        // Import updateProductsFromCart from Dropins API
        let updateProductsFromCart;
        (async () => {
          const api = await import('@dropins/storefront-cart/api.js');
          updateProductsFromCart = api.updateProductsFromCart;
        })();

        // Decrease button
        const decBtnContainer = document.createElement('div');
        decBtnContainer.className = 'dropin-incrementer__button-container';
        const decBtn = document.createElement('button');
        decBtn.type = 'button';
        decBtn.setAttribute('aria-label', 'Decrease Quantity');
        decBtn.className = 'dropin-incrementer__decrease-button';
        if (currentQty <= 1) decBtn.disabled = true;
        decBtn.innerHTML = '<svg width="16" height="16" viewBox="4 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="dropin-icon dropin-icon--shape-stroke-1 dropin-incrementer__down"><path d="M17.3332 11.75H6.6665" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round" vector-effect="non-scaling-stroke" fill="none" stroke="currentColor"></path></svg>';
        decBtnContainer.appendChild(decBtn);

        // Quantity input
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.name = 'quantity';
        qtyInput.className = 'dropin-incrementer__input';
        qtyInput.setAttribute('aria-label', 'Quantity');
        qtyInput.setAttribute('min', '1');
        qtyInput.setAttribute('step', '1');
        qtyInput.value = currentQty;

        // Price display
        const priceDisplay = document.createElement('span');
        priceDisplay.className = 'dropin-cart-item__price';
        priceDisplay.textContent = item.price ? `$${(item.price * currentQty).toFixed(2)}` : '';

        // Increase button
        const incBtnContainer = document.createElement('div');
        incBtnContainer.className = 'dropin-incrementer__button-container';
        const incBtn = document.createElement('button');
        incBtn.type = 'button';
        incBtn.setAttribute('aria-label', 'Increase Quantity');
        incBtn.className = 'dropin-incrementer__increase-button';
        incBtn.innerHTML = '<svg id="Icon_Add_Base" data-name="Icon – Add – Base" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="4 2 20 20" class="dropin-icon dropin-icon--shape-stroke-1 dropin-incrementer__add"><g id="Large"><rect id="Placement_area" data-name="Placement area" width="24" height="24" fill="#fff" opacity="0"></rect><g id="Add_icon" data-name="Add icon" transform="translate(9.734 9.737)"><line vector-effect="non-scaling-stroke" id="Line_579" data-name="Line 579" y2="12.7" transform="translate(2.216 -4.087)" fill="none" stroke="currentColor"></line><line vector-effect="non-scaling-stroke" id="Line_580" data-name="Line_580" x2="12.7" transform="translate(-4.079 2.263)" fill="none" stroke="currentColor"></line></g></g></svg>';
        incBtnContainer.appendChild(incBtn);

        // Helper to update UI and call mutation
        const updateUIAndCallMutation = async (newQty) => {
          currentQty = newQty;
          qtyInput.value = currentQty;
          decBtn.disabled = currentQty <= 1;
          if (updateProductsFromCart) {
            const result = await updateProductsFromCart([
              { uid: item.uid, quantity: currentQty },
            ]);
            // Find updated item and price
            if (result && result.items) {
              const updated = result.items.find((i) => i.uid === item.uid);
              if (updated && updated.price) {
                priceDisplay.textContent = `$${(updated.price * updated.quantity).toFixed(2)}`;
              } else {
                priceDisplay.textContent = item.price ? `$${(item.price * currentQty).toFixed(2)}` : '';
              }
            } else {
              priceDisplay.textContent = item.price ? `$${(item.price * currentQty).toFixed(2)}` : '';
            }
          } else {
            priceDisplay.textContent = item.price ? `$${(item.price * currentQty).toFixed(2)}` : '';
          }
        };

        decBtn.addEventListener('click', () => {
          if (currentQty > 1) {
            updateUIAndCallMutation(currentQty - 1);
          }
        });
        incBtn.addEventListener('click', () => {
          updateUIAndCallMutation(currentQty + 1);
        });
        qtyInput.addEventListener('change', () => {
          const val = Math.max(1, Number(qtyInput.value));
          updateUIAndCallMutation(val);
        });

        incrementerContent.appendChild(decBtnContainer);
        incrementerContent.appendChild(qtyInput);
        incrementerContent.appendChild(incBtnContainer);
        // incrementerContent.appendChild(priceDisplay);
        incrementer.appendChild(incrementerContent);

        ctx.appendChild(incrementer);
      },
    },
  })(block);

  // Add close icon after MiniCart is rendered
  const closeIcon = document.createElement('div');
  closeIcon.className = 'commerce-mini-cart__close-icon';
  closeIcon.innerHTML = `
    <button type="button" class="commerce-mini-cart__close-button" aria-label="Close mini cart">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;

  // Add event listener to close the minicart
  closeIcon.querySelector('.commerce-mini-cart__close-button').addEventListener('click', () => {
    const minicartPanel = document.querySelector('.minicart-panel');
    if (minicartPanel) {
      minicartPanel.classList.remove('nav-tools-panel--show');
    }
  });

  // Add close icon to the block
  block.appendChild(closeIcon);

  // Find the products container and add the message div at the top
  const productsContainer = block.querySelector('.cart-mini-cart__products');
  if (productsContainer) {
    productsContainer.insertBefore(shadowWrapper, productsContainer.firstChild);
  } else {
    console.info('Products container not found, appending message to block');
    block.appendChild(shadowWrapper);
  }

  return block;
}
