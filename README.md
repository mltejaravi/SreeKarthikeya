# Sree Karthikeya Plywood & Hardware — Website

Static marketing website (HTML, CSS, JavaScript — no build step) for
**Sree Karthikeya Plywood & Hardware**, Raidurgam, Hyderabad · 📞 +91 97049 97041.

## Features
- Full-screen home-page carousel (autoplay, arrows, dots, swipe, keyboard)
- About, Services, Products, Process, Gallery (filter + lightbox), Reviews, Contact
- Google Map pinned at the exact store location (17.4164966, 78.392034) with a Directions button
- Enquiry form that opens WhatsApp with the message pre-filled (no backend needed)
- Click-to-call & WhatsApp floating buttons, fully responsive for mobile

## Structure
```
index.html
css/style.css
js/main.js
assets/images/   (interior photos, from Unsplash)
assets/favicon.svg
.nojekyll
```

## Run locally
Open `index.html` in a browser, or:
```bash
python3 -m http.server 8080
```

## Deploy to GitHub Pages
1. Create a repository on GitHub (e.g. `sreekarthikeya`) and push these files to the `main` branch.
2. On GitHub go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

All paths are relative, so the site works both at a repo sub-path and on a custom domain.

## Image credits
Interior photographs from [Unsplash](https://unsplash.com) (free to use under the Unsplash License).
Replace files in `assets/images/` with your own project photos any time — keep the same file names.
