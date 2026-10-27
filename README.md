# Aditya Gaurav — portfolio (React + Vite)

## Run it
```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the built dist/ locally
```

Deploy by uploading the contents of `dist/` to any static host (Vercel, Netlify, GitHub Pages, nginx). Asset paths are relative, so it also works from a sub-folder.

## Images
Put these two files in `public/` (they are copied into `dist/` on build):
- `public/Aditya Gaurav.jpeg` — hero photo (keep the space in the name)
- `public/wikiclub-logo.svg` — WikiClub Tech UU logo

If a file is missing, its spot is hidden rather than showing a broken image.

## Where things live
- `src/data/content.js` — all projects, filters, achievements, skills and the email. Edit text here.
- `src/components/` — one component per section, plus the header, footer and project popup.
- `src/engines/preloader.js` — the particle preloader (particles form the Earth, then burst).
- `src/engines/earth.js` — the 3D Earth behind the page (three.js 0.143, pinned on purpose).
- `src/engines/scroll.js` — smooth scrolling (Lenis) and in-page link scrolling.
- `src/engines/scan.js` — the animated blood-smear scan in the Research section.
- `src/engines/bus.js` — the two signals that link them: `earth-ready` and `boot-done`.
- `src/styles.css` — all styles.
