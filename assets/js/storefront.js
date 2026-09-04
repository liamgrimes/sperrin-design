(function () {
  const storefront = window.SPERRIN_STOREFRONT || {};
  const PRODUCTS = Array.isArray(storefront.PRODUCTS) ? storefront.PRODUCTS : [];
  const SHOPIFY_CONFIG = storefront.SHOPIFY_CONFIG;
  const GBP_MONEY_FORMAT = '%C2%A3%7B%7Bamount%7D%7D';

  PRODUCTS.forEach((product) => {
    if (typeof product.price === 'string' && !product.price.startsWith('£')) {
      product.price = `£${product.price.replace(/^[^\d]*/, '').replace(/\D.*$/, '')}`;
    }
  });

  const isConfigured =
    typeof SHOPIFY_CONFIG?.domain === 'string' &&
    typeof SHOPIFY_CONFIG?.storefrontAccessToken === 'string' &&
    !SHOPIFY_CONFIG.domain.startsWith('YOUR-') &&
    !SHOPIFY_CONFIG.storefrontAccessToken.startsWith('YOUR_');

  function initializeStorefront() {
    const grid = document.getElementById('product-grid');
    const filterBar = document.getElementById('filters');
    const zoomModal = document.getElementById('zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    const zoomClose = document.getElementById('zoom-close');
    const zoomPrev = document.getElementById('zoom-prev');
    const zoomNext = document.getElementById('zoom-next');
    const zoomCounter = document.getElementById('zoom-counter');
    const detailView = document.getElementById('detail-view');
    const gridView = document.getElementById('grid-view');

    if (!grid || !filterBar || !zoomModal || !zoomImage || !zoomClose || !zoomPrev || !zoomNext || !zoomCounter || !detailView || !gridView) {
      return;
    }

    const categories = ['All', ...new Set(PRODUCTS.map((product) => product.category))];

    let zoomImages = [];
    let zoomIndex = 0;
    let zoomTitle = 'Product image';

function buildGalleryHtml(product, key) {
  const hasMultiple = product.images.length > 1;
  const imagesHtml = product.images
    .map(
      (src) =>
        `<img src="${src}" alt="${product.name}" loading="lazy" tabindex="0" aria-label="Enlarge ${product.name} image">`
    )
    .join('');

  const dotsHtml = hasMultiple
    ? `<div class="photo-dots">${product.images
        .map((_, index) => `<span class="dot${index === 0 ? ' active' : ''}"></span>`)
        .join('')}</div>`
    : '';

  const navHtml = hasMultiple
    ? `<button class="photo-nav prev" aria-label="Previous photo" type="button">‹</button>
       <button class="photo-nav next" aria-label="Next photo" type="button">›</button>`
    : '';

  return `<div class="photo-scroller" id="scroller-${key}">${imagesHtml}</div><span class="price-tag">${product.price}</span>${navHtml}${dotsHtml}`;
}

function renderNotConnected(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.innerHTML = '<div class="not-connected">Connect Shopify to enable checkout for this item</div>';
}

function createProductCardMarkup(product, index) {
  return `
    <div class="product-photo">${buildGalleryHtml(product, `grid-${index}`)}</div>
    <div class="product-body">
      <h3 class="product-name"><a href="#product-${index}">${product.name}</a></h3>
      <p class="product-desc">${product.description}</p>
      <div class="buy-mount" id="buy-mount-${index}"></div>
    </div>
  `;
}

function createProductDetailMarkup(product, index) {
  const hasLength = product.sizeGuide?.some((row) => row.length);
  const sizeChipsHtml = product.sizes
    ? `<p class="detail-section-label">Size</p>
       <div class="size-chips" role="group" aria-label="Select a size">
         ${product.sizes
           .map((size, sizeIndex) => `<button type="button" class="size-chip" aria-pressed="${sizeIndex === 0}">${size}</button>`)
           .join('')}
       </div>`
    : '';

  const sizeGuideHtml = product.sizeGuide
    ? `<p class="detail-section-label">Size guide</p>
       <table class="size-guide">
         <thead><tr><th>Size</th><th>Measurement</th>${hasLength ? '<th>Length</th>' : ''}</tr></thead>
         <tbody>
          <p>
            Each piece is tailor made to fit the measurements listed in the size guide below. If your size is not listed, please contact us <u><b><a href="contact.html">here</a></b></u> to discuss a custom order.
          </p>
           ${product.sizeGuide
             .map((row) => `<tr><td>${row.size}</td><td>${row.chest || row.waist}</td>${hasLength ? `<td>${row.length || ''}</td>` : ''}</tr>`)
             .join('')}
         </tbody>
       </table>`
    : '';

  return `
    <button class="detail-back" type="button">← Back to shop</button>
    <div class="product-detail">
      <div class="detail-photo">${buildGalleryHtml(product, `detail-${index}`)}</div>
      <div class="detail-info">
        <span class="eyebrow">${product.category}</span>
        <h2>${product.name}</h2>
        <p class="detail-price">${product.price}</p>
        <p class="detail-desc">${product.details || product.description}</p>
        ${sizeChipsHtml}
        ${sizeGuideHtml}
        <div class="buy-mount detail-buy-mount" id="buy-mount-detail-${index}"></div>
      </div>
    </div>
  `;
}

function wireGallery(root, count) {
  if (count <= 1) return;

  const scroller = root.querySelector('.photo-scroller');
  const dots = root.querySelectorAll('.photo-dots .dot');
  const prevBtn = root.querySelector('.photo-nav.prev');
  const nextBtn = root.querySelector('.photo-nav.next');

  const scrollToIndex = (index) => {
    const clamped = Math.max(0, Math.min(count - 1, index));
    scroller.scrollTo({ left: clamped * scroller.clientWidth, behavior: 'smooth' });
  };

  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    scrollToIndex(Math.round(scroller.scrollLeft / scroller.clientWidth) - 1);
  });

  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    scrollToIndex(Math.round(scroller.scrollLeft / scroller.clientWidth) + 1);
  });

  let scrollTimer;
  scroller.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const current = Math.round(scroller.scrollLeft / scroller.clientWidth);
      dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
    }, 60);
  });
}

function wireDetailZoom(root, productName, images) {
  root.querySelectorAll('.photo-scroller img').forEach((img, index) => {
    img.addEventListener('click', () => openZoomModal(images, index, productName));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openZoomModal(images, index, productName);
      }
    });
  });
}

function updateZoomControls() {
  const hasMultiple = zoomImages.length > 1;
  zoomPrev.hidden = !hasMultiple;
  zoomNext.hidden = !hasMultiple;
  zoomCounter.textContent = hasMultiple ? `${zoomIndex + 1} / ${zoomImages.length}` : '1 / 1';
}

function setZoomImage(index) {
  if (!zoomImages.length) return;
  const clampedIndex = (index + zoomImages.length) % zoomImages.length;
  zoomIndex = clampedIndex;
  zoomImage.src = zoomImages[clampedIndex];
  zoomImage.alt = `${zoomTitle} ${clampedIndex + 1} of ${zoomImages.length}`;
  updateZoomControls();
}

function openZoomModal(images, startIndex, title) {
  zoomImages = Array.isArray(images) ? images.slice() : [images];
  zoomTitle = title || 'Product image';
  setZoomImage(startIndex || 0);
  zoomModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeZoomModal() {
  zoomModal.hidden = true;
  document.body.style.overflow = '';
  zoomImages = [];
  zoomIndex = 0;
  zoomTitle = 'Product image';
  updateZoomControls();
}

function renderFilters() {
  filterBar.replaceChildren();
  categories.forEach((category, index) => {
    const button = document.createElement('button');
    button.className = 'chip';
    button.textContent = category;
    button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    button.addEventListener('click', () => {
      filterBar.querySelectorAll('.chip').forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      document.querySelectorAll('.product-card').forEach((card) => {
        const match = category === 'All' || card.dataset.category === category;
        card.style.display = match ? '' : 'none';
      });
    });
    filterBar.appendChild(button);
  });
}

function renderProductCards() {
  grid.replaceChildren();
  PRODUCTS.forEach((product, index) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.category = product.category;
    card.innerHTML = createProductCardMarkup(product, index);
    grid.appendChild(card);

    if (!isConfigured || product.id.startsWith('REPLACE_WITH')) {
      renderNotConnected(`buy-mount-${index}`);
    }

    wireGallery(card.querySelector('.product-photo'), product.images.length);
    card.querySelector('.product-photo').addEventListener('click', (event) => {
      if (event.target.closest('.photo-nav')) return;
      window.location.hash = `product-${index}`;
    });
  });
}

function renderProductDetails() {
  detailView.replaceChildren();
  PRODUCTS.forEach((product, index) => {
    const section = document.createElement('section');
    section.className = 'product-detail-page';
    section.hidden = true;
    section.id = `detail-${index}`;
    section.innerHTML = createProductDetailMarkup(product, index);
    detailView.appendChild(section);

    if (!isConfigured || product.id.startsWith('REPLACE_WITH')) {
      renderNotConnected(`buy-mount-detail-${index}`);
    }

    wireGallery(section.querySelector('.detail-photo'), product.images.length);
    wireDetailZoom(section.querySelector('.detail-photo'), product.name, product.images);

    section.querySelector('.detail-back').addEventListener('click', () => {
      window.location.hash = '';
    });

    section.querySelectorAll('.size-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        section.querySelectorAll('.size-chip').forEach((sizeChip) => sizeChip.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
      });
    });
  });
}

function showGrid() {
  gridView.hidden = false;
  detailView.hidden = true;
  detailView.querySelectorAll('.product-detail-page').forEach((section) => {
    section.hidden = true;
  });
}

function showDetail(index) {
  const section = document.getElementById(`detail-${index}`);
  if (!section) {
    showGrid();
    return;
  }

  gridView.hidden = true;
  detailView.hidden = false;
  detailView.querySelectorAll('.product-detail-page').forEach((productSection) => {
    productSection.hidden = true;
  });
  section.hidden = false;
  window.scrollTo({ top: 0 });
}

function route() {
  const match = window.location.hash.match(/^#product-(\d+)$/);
  if (match) {
    showDetail(Number(match[1]));
  } else {
    showGrid();
  }
}

function initShopifyBuy() {
  if (!isConfigured) return;

  const client = ShopifyBuy.buildClient({
    domain: SHOPIFY_CONFIG.domain,
    storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
  });

  const shopifyButtonStyles = {
    'background-color': 'rgba(26, 26, 26, 0.84)',
    'border': 'none',
    'border-radius': '999px',
    'color': '#FFFFFF',
    'font-family': "'Inter', sans-serif",
    'font-size': '0.8rem',
    'font-weight': '500',
    'letter-spacing': '0.04em',
    'padding': '5px 10px',
    ':hover': {
      'background-color': '#1A1A1A',
    },
    ':focus': {
      'background-color': '#1A1A1A',
    },
  };

  ShopifyBuy.UI.onReady(client).then((ui) => {
    ui.createComponent('cart', {
      node: document.getElementById('cart-mount'),
      moneyFormat: GBP_MONEY_FORMAT,
      options: {
        cart: {
          styles: {
            footer: { 'background-color': '#F7F7F5' },
          },
          text: { total: 'Subtotal', button: 'Checkout' },
        },
        toggle: {
          styles: {
            toggle: {
              'background-color': '#16181B',
              ':hover': { 'background-color': '#2A2D33' },
              'font-family': "'Inter', sans-serif",
              'font-weight': '600',
            },
          },
        },
      },
    });

    PRODUCTS.forEach((product, index) => {
      if (product.id.startsWith('REPLACE_WITH')) return;

      ui.createComponent('product', {
        id: product.id,
        node: document.getElementById(`buy-mount-${index}`),
        moneyFormat: GBP_MONEY_FORMAT,
        options: {
          product: {
            iframe: false,
            contents: { img: false, title: false, price: false, options: false },
            styles: {
              button: shopifyButtonStyles,
            },
            buttonDestination: 'cart',
            text: { button: 'Add to cart' },
          },
        },
      });

      ui.createComponent('product', {
        id: product.id,
        node: document.getElementById(`buy-mount-detail-${index}`),
        moneyFormat: GBP_MONEY_FORMAT,
        options: {
          product: {
            iframe: false,
            contents: { img: false, title: false, price: false, options: true },
            styles: {
              button: shopifyButtonStyles,
            },
            buttonDestination: 'cart',
            text: { button: 'Add to cart' },
          },
        },
      });
    });
  });
}

    renderFilters();
    renderProductCards();
    renderProductDetails();
    route();

    zoomClose.addEventListener('click', closeZoomModal);
    zoomModal.addEventListener('click', (event) => {
      if (event.target === zoomModal) closeZoomModal();
    });
    zoomPrev.addEventListener('click', () => setZoomImage(zoomIndex - 1));
    zoomNext.addEventListener('click', () => setZoomImage(zoomIndex + 1));
    document.addEventListener('keydown', (event) => {
      if (zoomModal.hidden) return;
      if (event.key === 'Escape') closeZoomModal();
      if (zoomImages.length > 1 && event.key === 'ArrowLeft') setZoomImage(zoomIndex - 1);
      if (zoomImages.length > 1 && event.key === 'ArrowRight') setZoomImage(zoomIndex + 1);
    });
    updateZoomControls();
    window.addEventListener('hashchange', route);
    initShopifyBuy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStorefront);
  } else {
    initializeStorefront();
  }
})();
