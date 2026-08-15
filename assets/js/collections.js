/*
    Sperrin Design - Collections

    Handles:
    - Collections overview page
    - Individual collection pages
    - Collection cards
    - Collection piece galleries
    - Image navigation
*/


document.addEventListener("DOMContentLoaded", () => {
    loadCollections();
    loadCollectionPage();
});


// ------------------------------------------------
// Collections overview page
// ------------------------------------------------

function loadCollections() {
    const grid = document.querySelector("#collections-grid");
    if (!grid) return;

    window.SPERRIN_COLLECTIONS.COLLECTIONS.forEach(collection => {
        grid.appendChild(createCollectionCard(collection));
    });
}


// Creates collection preview cards

function createCollectionCard(collection) {
    const article = document.createElement("article");
    article.className = "collection-card";

    article.innerHTML = `
        <img
            src="${collection.coverImage}"
            alt="${collection.name}"
            class="collection-cover"
        >

        <div class="collection-body">
            <h2>${collection.name}</h2>

            <p>${collection.description}</p>

            <button class="collection-button">
                View Collection
            </button>
        </div>
    `;

    article.querySelector("button").addEventListener("click", () => {
        window.location.href =
            `collection.html?collection=${collection.slug}`;
    });

    return article;
}


// ------------------------------------------------
// Individual collection page
// ------------------------------------------------

function loadCollectionPage() {
    const gallery = document.querySelector("#collection-gallery");
    if (!gallery) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("collection");

    const collection =
        window.SPERRIN_COLLECTIONS.COLLECTIONS.find(
            item => item.slug === slug
        );

    if (!collection) return;

    document.querySelector("#collection-title").textContent =
        collection.name;

    document.querySelector("#collection-description").textContent =
        collection.description;

    collection.pieces.forEach(piece => {
        gallery.appendChild(createPieceCard(piece));
    });
}


// ------------------------------------------------
// Collection piece cards
// ------------------------------------------------

// Creates a piece card with an image gallery

function createPieceCard(piece) {
    const article = document.createElement("article");
    article.className = "collection-piece";

    article.innerHTML = `
        <div class="product-photo">
            ${buildCollectionGallery(piece)}
        </div>

        <div class="piece-info">
            <h2>${piece.name}</h2>

            <p>${piece.description}</p>

            <p>Photographer: ${piece.photographer}</p>

            <p>Model: ${piece.model}</p>
        </div>
    `;

    wireGallery(article.querySelector(".product-photo"), piece.images.length);

    return article;
}


// ------------------------------------------------
// Collection image gallery
// ------------------------------------------------

// Builds the image scroller, arrows and dots

function buildCollectionGallery(piece) {
    const hasMultiple = piece.images.length > 1;

    const imagesHtml = piece.images
        .map(src => `
            <img
                src="${src}"
                alt="${piece.name}"
                loading="lazy"
            >
        `)
        .join("");

    const dotsHtml = hasMultiple
        ? `
            <div class="photo-dots">
                ${piece.images
                    .map((_, index) =>
                        `<span class="dot${index === 0 ? " active" : ""}"></span>`
                    )
                    .join("")}
            </div>
        `
        : "";

    const navHtml = hasMultiple
        ? `
            <button
                class="photo-nav prev"
                aria-label="Previous photo"
                type="button">
                ‹
            </button>

            <button
                class="photo-nav next"
                aria-label="Next photo"
                type="button">
                ›
            </button>
        `
        : "";

    return `
        <div class="photo-scroller">
            ${imagesHtml}
        </div>

        ${navHtml}
        ${dotsHtml}
    `;
}


// ------------------------------------------------
// Gallery navigation
// ------------------------------------------------

// Controls scrolling between images

function wireGallery(root, count) {
    if (count <= 1) return;

    const scroller = root.querySelector(".photo-scroller");
    const dots = root.querySelectorAll(".photo-dots .dot");
    const prevBtn = root.querySelector(".photo-nav.prev");
    const nextBtn = root.querySelector(".photo-nav.next");

    const scrollToIndex = index => {
        const clamped = Math.max(0, Math.min(count - 1, index));

        scroller.scrollTo({
            left: clamped * scroller.clientWidth,
            behavior: "smooth"
        });
    };

    prevBtn.addEventListener("click", event => {
        event.stopPropagation();

        scrollToIndex(
            Math.round(scroller.scrollLeft / scroller.clientWidth) - 1
        );
    });

    nextBtn.addEventListener("click", event => {
        event.stopPropagation();

        scrollToIndex(
            Math.round(scroller.scrollLeft / scroller.clientWidth) + 1
        );
    });

    let scrollTimer;

    scroller.addEventListener("scroll", () => {
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
            const current = Math.round(
                scroller.scrollLeft / scroller.clientWidth
            );

            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === current);
            });
        }, 60);
    });
}