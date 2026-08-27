(function () {
  const SITE_NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Collections', href: 'collections.html' },
    { label: 'Store', href: 'storefront.html' },
    { label: 'Contact', href: 'contact.html' },
  ];

  function createSiteHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';

    const logo = document.createElement('div');
    logo.className = 'logo';

    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.setAttribute('aria-label', 'Sperrin Design home');

    const logoImage = document.createElement('img');
    logoImage.src = 'assets/images/sperrin-logo-removebg-preview.png';
    logoImage.alt = 'Sperrin Design logo';
    logoImage.loading = 'eager';

    logoLink.appendChild(logoImage);
    logo.appendChild(logoLink);

    const nav = document.createElement('nav');
    const navList = document.createElement('ul');

    SITE_NAV.forEach((item) => {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = item.href;
      anchor.textContent = item.label;
      listItem.appendChild(anchor);
      navList.appendChild(listItem);
    });

    nav.appendChild(navList);
    header.append(logo, nav);

    return header;
  }

  function createSiteFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    const noteHost = document.querySelector('[data-site-footer-note]');
    if (noteHost) {
      const note = noteHost.cloneNode(true);
      noteHost.remove();
      footer.appendChild(note);
    }

    const copy = document.createElement('p');
    copy.textContent = '© 2026 Sperrin Design';
    footer.appendChild(copy);

    return footer;
  }

  function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('[data-site-header] a, header nav a');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === currentPage;
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  function mountSharedShell() {
    const headerHost = document.querySelector('[data-site-header]');
    const footerHost = document.querySelector('[data-site-footer]');

    if (headerHost) {
      headerHost.replaceWith(createSiteHeader());
    } else if (!document.querySelector('header')) {
      document.body.insertBefore(createSiteHeader(), document.body.firstChild);
    }

    if (footerHost) {
      footerHost.replaceWith(createSiteFooter());
    } else if (!document.querySelector('footer')) {
      document.body.appendChild(createSiteFooter());
    }

    setActiveNavItem();
  }

  function renderRandomProduct() {
    const productHost = document.querySelector('#random-product');

    if (!productHost) return;

    const products = window.SPERRIN_STOREFRONT?.PRODUCTS;

    if (!products || !products.length) return;

    const randomProduct =
      products[Math.floor(Math.random() * products.length)];

    productHost.innerHTML = `
      <a href="storefront.html" class="random-product-card">
        <img
          src="${randomProduct.images[0]}"
          alt="${randomProduct.name}"
        >

        <div class="random-product-info">
          <h3>${randomProduct.name}</h3>
          <p>${randomProduct.price}</p>
        </div>
      </a>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    mountSharedShell();
    renderRandomProduct();
  });
})();
