# SPERRIN DESIGN – TESTING NOTES

## GENERAL

* Tested the site locally using the Python HTTP server.
* Checked that the shared navbar loads correctly across pages.
* Checked navigation links between pages.
* Checked CSS loading and general page layout.
* Tested responsive layouts on desktop and mobile.

## HOME PAGE

* Checked the homepage layout and images.
* Checked image sizing and positioning.
* Checked the responsive layout.

## ABOUT PAGE

* Checked the overall About page layout.
* Checked the alternating image/text layout on desktop.
* Checked the mobile layout.
* Checked that images are centred on mobile.
* Checked that the text is justified on mobile.
* Checked image sizing and positioning.
* Checked all five sections and their corresponding images.

## COLLECTIONS PAGE

* Checked the collections page layout.
* Added a second collection to test how multiple collections appear.
* Checked that collection cards are generated correctly.
* Checked collection names, descriptions and cover images.
* Checked that collection cards link to the correct collection.
* Checked the collections grid and responsive layout.

## INDIVIDUAL COLLECTION PAGES

* Checked that the correct collection loads from the URL.
* Checked collection title and description.
* Checked that collection pieces load correctly.
* Checked piece names and descriptions.
* Checked photographer and model information.
* Checked collection images and image sizing.
* Standardised the collection image aspect ratio.
* Checked multiple images within a piece.
* Checked single-image pieces.
* Checked the image scrolling and snap behaviour.
* Checked editorial images.
* Checked collections that only contain editorial images.

## COLLECTION IMAGE GALLERIES

* Tested the previous and next image buttons.
* Checked that the previous arrow is hidden on the first image.
* Checked that the next arrow is hidden on the last image.
* Checked that both arrows appear when viewing a middle image.
* Checked the navigation dots.
* Checked that the active dot changes when moving between images.
* Tested the gallery with lazy-loaded images.
* Used DevTools to check the gallery buttons and scroll position.
* Found that the gallery was initially calculating the navigation state before the lazy-loaded images had finished loading.
* Updated the gallery to run the navigation check again after the page loads.
* Confirmed the gallery arrows now work correctly.

## COLLECTION IMAGE STYLING

* Found that collection images were picking up the Store's zoom cursor.
* Added collection-specific CSS so the images do not appear zoomable.
* Checked the image cursor after the change.
* Checked image sizing and object-fit behaviour.

## COLLECTION STORE LINKS

* Added and checked links from collection pieces to Store products.
* Checked that links are generated from the product IDs.
* Checked that links only appear for available pieces.
* Checked multiple product links on a single piece.
* Checked the "Shop this look" section.
* Updated the buttons to match the styling of the Store's Add to Cart buttons.
* Found and removed/identified duplicate CSS that was overriding the intended button styling.

## COLLECTION DATA

* Checked the FW25 collection data.
* Added and tested the Festival Szn collection.
* Added/configured the Errigal Set.
* Checked the Errigal Set images.
* Checked model and photographer information.
* Checked product links for the Errigal Set.
* Checked the available/unavailable piece setup.
* Checked the editorial-only collection setup.

## JAVASCRIPT

* Checked that main.js loads correctly.
* Checked that collections.js loads correctly.
* Checked that collections-data.js loads correctly.
* Tested collection loading from the URL.
* Tested collection piece generation.
* Tested gallery generation and navigation.
* Tested gallery navigation through DevTools.
* Fixed the lazy-loading issue affecting the initial gallery navigation.

## DEBUGGING

* Used the browser console to investigate gallery issues.
* Checked the Chrome lazy-loading warning and confirmed it was not an actual JavaScript error.
* Checked the favicon 404 and confirmed it is unrelated to the site functionality.
* Checked the gallery's scroll position in DevTools.
* Confirmed the initial gallery position is 0.
* Manually tested the hidden property on the previous arrow to confirm the CSS was working correctly.

## ISSUES FIXED

* Collection images incorrectly showing the Store zoom cursor.
* Collection image sizing/aspect ratio issues.
* Collection gallery arrows not hiding correctly.
* Previous arrow remaining visible on the first image.
* Next arrow remaining visible on the last image.
* Lazy-loaded images affecting the initial gallery navigation.
* Collection Store-link buttons being overridden by duplicate CSS.
* Store-link buttons not matching the intended styling.
* Collection page dependency issue with storefront-data.js.
* JavaScript errors in storefront-data.js encountered during development and subsequently fixed.

## KNOWN ISSUE

* favicon.ico currently returns a 404.
* This does not affect the functionality of the site and can be fixed later.

## TESTING SCOPE

This covers the testing and debugging carried out during development of
the areas worked on above.

Storefront testing and Contact page/backend testing are not included here,
as these were tested by Kathryn and Karen.
