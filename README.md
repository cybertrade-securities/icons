# CyberTrade Icons

28 CyberTrade logo assets: 21 square colorways and 7 original images.

- `assets/solid/`: 9 solid background and wordmark combinations.
- `assets/cybertrade-wordmark.svg`: original Portal wordmark used in the gallery header.
- `assets/gradient/`: 12 gradient editions with subtle glow and grid details.
- Each generated colorway includes a scalable SVG and a 1024 × 1024 PNG.
- `assets/original/`: 7 existing repository PNGs, renamed by color and format without modifying image data. Includes cyan/black, magenta/black, blue-violet/black, blue-violet/white, yellow/black at 128 and 1600 pixels, and a 958 × 238 black-on-white wordmark.
- `cybertrade-logos.zip`: all logo files and palette CSVs.
- `index.html`: responsive gallery with category filters, enlarged previews, and downloads.
- The customizer supports independent solid, linear-gradient, and radial-gradient fills for the background and Portal wordmark, direction controls, and SVG/1024-pixel PNG export. Color changes and exports run locally in the browser.

Preview: https://cybertrade-securities.github.io/icons/

No dependencies or build step. Serve the repository root (for example, `python3 -m http.server 8000`) to preview all features; the customizer loads the Portal SVG over HTTP.
GitHub Pages publishes from the root of the `master` branch.
