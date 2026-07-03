# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-scroll `index.html` portfolio with a 5-page site (Home, Research, Education, Publications, News & Media) using a warm cream+light-blue visual system, and retire the dead file variants left over from earlier redesign attempts.

**Architecture:** Static HTML/CSS/JS, no build step (matches the existing site and GitHub Pages hosting). A shared `partials.js` builds a common header/nav and footer via DOM APIs (not `innerHTML` — everything rendered is a hardcoded string we author, but building nodes directly is just as easy here and sidesteps any XSS-pattern lint entirely) and inserts them into every page. One shared `style.css` carries the new design tokens and component styles.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties), vanilla JS, Boxicons (already used, kept), Google Fonts (Lora + Inter).

**Testing approach:** This is a static content site with no test framework and no interactive logic worth unit-testing — "tests" here means visually verifying each page in a real browser at desktop/tablet/mobile widths using the preview tools (screenshot, snapshot, inspect, console) after each task, per the project's UI-verification requirement. Every task's verification step says exactly what to look at and what "passing" looks like.

---

## Task 1: Local preview server

**Files:**
- Create: `.claude/launch.json`

- [ ] **Step 1: Confirm you're on the `redesign-2026` branch, not `main`**

```bash
git -C Angelo-Portfolio branch --show-current
```

Expected: `redesign-2026`. If it prints `main` instead, run
`git -C Angelo-Portfolio checkout redesign-2026` before doing anything else in this plan — every
task in this plan commits locally to this branch, and nothing gets pushed to `origin` until the
whole redesign is reviewed and approved.

- [ ] **Step 2: Write the launch config**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "portfolio-static",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "8000", "--directory", "Angelo-Portfolio"],
      "port": 8000
    }
  ]
}
```

Note: `--directory Angelo-Portfolio` is required because the session's working directory is
`portfolio_and_CV` (the parent folder), not the `Angelo-Portfolio` repo itself.

- [ ] **Step 3: Start the server with the preview tool and verify**

Use `mcp__Claude_Preview__preview_start` with `name: "portfolio-static"`, then
`mcp__Claude_Preview__preview_screenshot` on `http://localhost:8000/index.html`.

Expected: the current (pre-redesign) homepage loads without a 404. This confirms the server is
wired to the right directory before we start rebuilding pages on top of it.

- [ ] **Step 4: Commit**

```bash
git add .claude/launch.json
git commit -m "Add local preview server config for portfolio redesign"
```

---

## Task 2: Reorganize assets and generate favicon set

**Files:**
- Create: `assets/images/` (headshot, ADSA photos, project screenshots)
- Create: `assets/logos/` (UF, USLS, AIAOS Lab)
- Create: `assets/favicon/` (generated icon sizes)
- Delete: `assets/raw/` (contents moved out)

- [ ] **Step 1: Move staged assets into their final folders**

```bash
cd Angelo-Portfolio
mkdir -p assets/images assets/logos assets/favicon
mv assets/raw/headshot.png assets/images/headshot.png
mv assets/raw/AD_award.jpeg assets/images/adsa-award-plaque.jpg
mv assets/raw/AD_ceremony.jpeg assets/images/adsa-award-ceremony.jpg
mv assets/raw/AD_poster.jpeg assets/images/adsa-poster-presentation.jpg
mv assets/raw/AD_HY.JPG assets/images/adsa-with-advisor.jpg
mv assets/raw/uf-logo.png assets/logos/uf-logo.png
mv assets/raw/usls-logo.svg assets/logos/usls-logo.svg
mv assets/raw/aiaos-lab-logo.png assets/logos/aiaos-lab-logo.png
mv AnimalMotionViz.png assets/images/animalmotionviz.png
mv HeatStressApp.png assets/images/heatstressapp.png
rmdir assets/raw
```

- [ ] **Step 2: Generate favicon sizes from the headshot using macOS `sips` (no extra tools needed)**

```bash
sips -z 32 32 assets/images/headshot.png --out assets/favicon/favicon-32x32.png
sips -z 180 180 assets/images/headshot.png --out assets/favicon/apple-touch-icon.png
sips -z 192 192 assets/images/headshot.png --out assets/favicon/android-chrome-192x192.png
sips -z 512 512 assets/images/headshot.png --out assets/favicon/android-chrome-512x512.png
```

Modern browsers accept a PNG favicon directly via `<link rel="icon" type="image/png">`, so no
`.ico` conversion step is needed.

- [ ] **Step 3: Verify**

```bash
ls assets/images assets/logos assets/favicon
```

Expected: `assets/images` has 7 files (headshot + 4 ADSA photos + 2 project screenshots),
`assets/logos` has 3 files, `assets/favicon` has 4 files, `assets/raw` no longer exists.

- [ ] **Step 4: Commit**

```bash
git add -A assets AnimalMotionViz.png HeatStressApp.png
git commit -m "Reorganize assets into images/logos/favicon, generate favicon set"
```

---

## Task 3: Design tokens and shared stylesheet

**Files:**
- Modify: `style.css` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `style.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg-page: #FAF6EC;
  --bg-card: #DCEBF7;
  --bg-card-alt: #F3EBDA;
  --accent: #2C5C82;
  --accent-dark: #1B3A5C;
  --text-primary: #3D3A30;
  --text-secondary: #6B6558;
  --border: #E4DCC8;
  --white: #FFFFFF;

  --tag-journal-bg: #DCEBF7;
  --tag-journal-text: #1B3A5C;
  --tag-conference-bg: #F3EBDA;
  --tag-conference-text: #6B5A3A;
  --tag-preprint-bg: #ECEAE3;
  --tag-preprint-text: #5C584C;

  --font-heading: 'Lora', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

  --radius: 12px;
  --shadow-sm: 0 1px 3px rgba(61, 58, 48, 0.08);
  --shadow-md: 0 4px 16px rgba(61, 58, 48, 0.10);
  --max-width: 1100px;
  --header-height: 72px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg-page);
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 16px;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--accent-dark);
  line-height: 1.25;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 1.9rem; margin-bottom: 1.25rem; }
h3 { font-size: 1.3rem; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

img { max-width: 100%; display: block; }

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.page-section {
  padding: 64px 0;
}

/* Header / nav */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-page);
  border-bottom: 1px solid var(--border);
}

.site-header__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.site-logo {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--accent-dark);
}
.site-logo:hover { text-decoration: none; }

.site-nav {
  display: flex;
  gap: 8px;
}

.site-nav a {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.site-nav a:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }

.site-nav a.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--white);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.nav-toggle span {
  width: 22px;
  height: 2px;
  background: var(--accent-dark);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 0.95rem;
  border: 1px solid transparent;
}
.btn:hover { text-decoration: none; }

.btn--accent {
  background: var(--accent);
  color: var(--white);
}
.btn--accent:hover { background: var(--accent-dark); }

.btn--outline {
  background: transparent;
  border-color: var(--accent);
  color: var(--accent);
}
.btn--outline:hover { background: var(--bg-card); }

/* Cards */
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.card img {
  border-radius: calc(var(--radius) - 4px);
  margin-bottom: 16px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.tag--journal { background: var(--tag-journal-bg); color: var(--tag-journal-text); }
.tag--conference { background: var(--tag-conference-bg); color: var(--tag-conference-text); }
.tag--preprint { background: var(--tag-preprint-bg); color: var(--tag-preprint-text); }

/* Hero (home page) */
.hero {
  padding: 80px 0;
  display: flex;
  align-items: center;
  gap: 48px;
}

.hero__image img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--white);
  box-shadow: var(--shadow-md);
}

.hero__eyebrow {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.hero__description {
  max-width: 46ch;
  color: var(--text-secondary);
  margin: 16px 0 24px;
}

.hero__actions { display: flex; gap: 12px; flex-wrap: wrap; }

.highlight-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 24px;
  margin-top: 32px;
}

/* Education timeline */
.timeline-item {
  display: flex;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
}
.timeline-item:last-child { border-bottom: none; }

.timeline-item__logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
}

.timeline-item__logos {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

/* Research focus cards */
.focus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

/* Publication list */
.pub-group { margin-bottom: 48px; }
.pub-item { margin-bottom: 20px; }
.pub-item__title { font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 4px; color: var(--text-primary); }
.pub-item__authors { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 4px; }
.pub-item__venue { font-size: 0.9rem; }

/* News gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.gallery-item img {
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.gallery-item__caption {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Footer */
.site-footer {
  background: var(--accent-dark);
  color: var(--white);
  padding: 48px 0;
  margin-top: 64px;
}

.site-footer__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.site-footer .btn--accent { background: var(--white); color: var(--accent-dark); }
.site-footer .btn--accent:hover { background: var(--bg-card); }
.site-footer .btn--outline { border-color: var(--white); color: var(--white); }
.site-footer .btn--outline:hover { background: rgba(255,255,255,0.1); }

.site-footer__cv { display: flex; justify-content: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }

.site-footer__social { display: flex; justify-content: center; gap: 16px; margin-bottom: 16px; font-size: 1.3rem; }
.site-footer__social a { color: var(--white); }

.site-footer__address, .site-footer__copyright {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.75);
}

/* Responsive */
@media (max-width: 768px) {
  .site-nav {
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--bg-page);
    border-bottom: 1px solid var(--border);
    flex-direction: column;
    padding: 16px 24px;
    display: none;
  }
  .site-nav.open { display: flex; }
  .nav-toggle { display: flex; }

  .hero { flex-direction: column; text-align: center; padding: 48px 0; }
  .hero__description { max-width: none; }
  .hero__actions { justify-content: center; }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }

  .timeline-item { flex-direction: column; gap: 12px; }
}
```

- [ ] **Step 2: Verify with the preview tool**

Reload `http://localhost:8000/index.html` (old markup will look broken against the new CSS —
expected at this point, since HTML hasn't been rewritten yet). Use
`mcp__Claude_Preview__preview_console_logs` with `level: "error"` to confirm no CSS parse errors
are logged.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "Rewrite style.css with warm cream+blue design tokens and new components"
```

---

## Task 4: Shared header/footer partial and nav behavior

**Files:**
- Create: `partials.js`
- Delete: `script.js` (superseded — old file's dark-mode toggle, scroll-spy, and PWA install-prompt code no longer apply to a multi-page site without dark mode)

- [ ] **Step 1: Write `partials.js`**

```javascript
const SITE_PAGES = [
  { id: 'home', href: 'index.html', label: 'Home' },
  { id: 'research', href: 'research.html', label: 'Research' },
  { id: 'education', href: 'education.html', label: 'Education' },
  { id: 'publications', href: 'publications.html', label: 'Publications' },
  { id: 'news', href: 'news.html', label: 'News & Media' },
];

function buildIcon(iconClass) {
  const icon = document.createElement('i');
  icon.className = iconClass;
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function buildHeader(activePage) {
  const wrapper = document.createElement('div');
  wrapper.className = 'site-header__inner';

  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'site-logo';
  logo.textContent = 'Angelo De Castro';

  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.id = 'site-nav';

  SITE_PAGES.forEach((page) => {
    const link = document.createElement('a');
    link.href = page.href;
    link.textContent = page.label;
    if (page.id === activePage) link.classList.add('active');
    nav.appendChild(link);
  });

  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.id = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.append(document.createElement('span'), document.createElement('span'), document.createElement('span'));

  wrapper.append(logo, nav, toggle);
  return wrapper;
}

function buildSocialLink(href, label, iconClass) {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', label);
  a.appendChild(buildIcon(iconClass));
  return a;
}

function buildFooter() {
  const wrapper = document.createElement('div');
  wrapper.className = 'site-footer__inner';

  const cvRow = document.createElement('div');
  cvRow.className = 'site-footer__cv';

  const cvLink = document.createElement('a');
  cvLink.href = 'https://angelodecastro.github.io/angelo_cv/CV_angelo.pdf';
  cvLink.target = '_blank';
  cvLink.rel = 'noopener noreferrer';
  cvLink.className = 'btn btn--accent';
  cvLink.append(buildIcon('bx bx-download'), document.createTextNode(' Download CV'));

  const emailLink = document.createElement('a');
  emailLink.href = 'mailto:decastro.a@ufl.edu';
  emailLink.className = 'btn btn--outline';
  emailLink.append(buildIcon('bx bx-envelope'), document.createTextNode(' Email me'));

  cvRow.append(cvLink, emailLink);

  const socialRow = document.createElement('div');
  socialRow.className = 'site-footer__social';
  socialRow.append(
    buildSocialLink('https://www.linkedin.com/in/angelo-de-castro-107718228/', 'LinkedIn', 'bx bxl-linkedin'),
    buildSocialLink('https://github.com/angelodecastro', 'GitHub', 'bx bxl-github'),
    buildSocialLink('https://scholar.google.com/citations?hl=en&user=nNXo_kwAAAAJ', 'Google Scholar', 'bx bxs-graduation'),
    buildSocialLink('https://orcid.org/0000-0002-8712-6153', 'ORCID', 'bx bx-id-card'),
    buildSocialLink('https://www.instagram.com/angelodecastro_/', 'Instagram', 'bx bxl-instagram'),
    buildSocialLink('http://www.youtube.com/@angelodecastro_', 'YouTube', 'bx bxl-youtube')
  );

  const address = document.createElement('p');
  address.className = 'site-footer__address';
  address.textContent = '2250 Shealy Dr., Gainesville, FL 32611';

  const copyright = document.createElement('p');
  copyright.className = 'site-footer__copyright';
  copyright.textContent = '© 2026 Angelo De Castro. All rights reserved.';

  wrapper.append(cvRow, socialRow, address, copyright);
  return wrapper;
}

function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const activePage = document.body.dataset.page;
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  if (headerSlot) headerSlot.appendChild(buildHeader(activePage));
  if (footerSlot) footerSlot.appendChild(buildFooter());

  initNavToggle();
});
```

- [ ] **Step 2: Delete the old script**

```bash
rm script.js
```

- [ ] **Step 3: Verify**

Run: `node --check partials.js`
Expected: no output (success — `node --check` prints nothing and exits 0 when syntax is valid).

- [ ] **Step 4: Commit**

```bash
git add partials.js
git rm script.js
git commit -m "Add shared header/footer partial, retire old script.js"
```

---

## Task 5: Home page

**Files:**
- Modify: `index.html` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Angelo De Castro - PhD Student in Animal Sciences at University of Florida, specializing in AI and computer vision for livestock farming.">
  <meta name="author" content="Angelo De Castro">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://angelodecastro.github.io/Angelo-Portfolio/">
  <meta property="og:title" content="Angelo De Castro - PhD Student & Researcher">
  <meta property="og:description" content="PhD Student in Animal Sciences at University of Florida, specializing in AI and computer vision for livestock farming.">
  <meta property="og:image" content="assets/images/headshot.png">

  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
  <link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2C5C82">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="style.css">
  <link href='https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css' rel='stylesheet'>

  <title>Angelo De Castro - Portfolio</title>
</head>
<body data-page="home">
  <header id="site-header" class="site-header"></header>

  <main>
    <section class="page-section hero container">
      <div class="hero__image">
        <img src="assets/images/headshot.png" alt="Angelo De Castro" loading="eager">
      </div>
      <div class="hero__text">
        <p class="hero__eyebrow">PhD Student &middot; Animal Sciences &middot; University of Florida</p>
        <h1>Angelo De Castro</h1>
        <p class="hero__description">
          I build AI and computer-vision tools for precision dairy cattle management &mdash; from
          automated animal tracking to multi-modal disease prediction &mdash; at the University of Florida.
        </p>
        <div class="hero__actions">
          <a href="publications.html" class="btn btn--accent">View publications</a>
          <a href="https://angelodecastro.github.io/angelo_cv/CV_angelo.pdf" target="_blank" rel="noopener noreferrer" class="btn btn--outline">Download CV</a>
        </div>
        <div class="highlight-banner">
          <i class='bx bxs-trophy' style="font-size: 1.6rem; color: var(--accent);" aria-hidden="true"></i>
          <span>1st Place, PhD Division &mdash; ADSA Purina Animal Nutrition Poster Competition, 2026. <a href="news.html">See photos &rarr;</a></span>
        </div>
      </div>
    </section>
  </main>

  <footer id="site-footer" class="site-footer"></footer>

  <script src="partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify with the preview tool**

Reload `http://localhost:8000/index.html`.
- `mcp__Claude_Preview__preview_snapshot`: confirm the nav shows Home (active), Research,
  Education, Publications, News & Media, and the hero shows name, tagline, and both buttons.
- `mcp__Claude_Preview__preview_resize` to `mobile` (375x812): confirm the nav collapses behind
  the hamburger button and clicking it (`mcp__Claude_Preview__preview_click` on `#nav-toggle`)
  reveals the links.
- `mcp__Claude_Preview__preview_console_logs`: no errors.

Expected: all of the above pass; the highlight banner links to `news.html` (that page doesn't
exist yet, so don't click through — just confirm the `href`).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rebuild home page with new hero and shared header/footer"
```

---

## Task 6: Education page

**Files:**
- Create: `education.html`

- [ ] **Step 1: Write `education.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Angelo De Castro's academic background - University of Florida and University of St. La Salle.">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
  <link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2C5C82">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="style.css">
  <link href='https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css' rel='stylesheet'>
  <title>Education - Angelo De Castro</title>
</head>
<body data-page="education">
  <header id="site-header" class="site-header"></header>

  <main>
    <section class="page-section container">
      <h2>Education</h2>

      <div class="timeline-item">
        <div class="timeline-item__logos">
          <img src="assets/logos/uf-logo.png" alt="University of Florida" class="timeline-item__logo">
          <img src="assets/logos/aiaos-lab-logo.png" alt="Animal Omics Sciences Lab" class="timeline-item__logo">
        </div>
        <div>
          <h3>Ph.D., Animal Sciences</h3>
          <p class="pub-item__authors">University of Florida, Gainesville, Florida &middot; August 2024 &ndash; present</p>
          <p>Advisor: Dr. Haipeng Yu, Animal Omics Sciences Lab.</p>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-item__logos">
          <img src="assets/logos/usls-logo.svg" alt="University of St. La Salle" class="timeline-item__logo">
        </div>
        <div>
          <h3>B.Sc., Electronics Engineering</h3>
          <p class="pub-item__authors">University of St. La Salle, Bacolod City, Philippines &middot; May 2022</p>
          <p>Thesis: &ldquo;Developing an Automated and Cost-Effective Animal Observation and Tracking System with the use of IoT and Machine Learning.&rdquo;</p>
          <p>Advisor: Engr. Myles Joshua T. Tan.</p>
        </div>
      </div>
    </section>
  </main>

  <footer id="site-footer" class="site-footer"></footer>

  <script src="partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify with the preview tool**

Reload `http://localhost:8000/education.html`.
- `preview_snapshot`: confirm "Education" is active in the nav, both timeline entries render with
  their logos, degree, institution, dates, and advisor text.
- `preview_console_logs`: no 404s for the three logo images (check with
  `mcp__Claude_Preview__preview_network`, filter `failed`).

Expected: no failed network requests, both entries visible with correct text.

- [ ] **Step 3: Commit**

```bash
git add education.html
git commit -m "Add education page with UF and USLS timeline entries"
```

---

## Task 7: Research page

**Files:**
- Create: `research.html`

- [ ] **Step 1: Write `research.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Angelo De Castro's research on AI and computer vision for precision dairy cattle management.">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
  <link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2C5C82">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="style.css">
  <link href='https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css' rel='stylesheet'>
  <title>Research - Angelo De Castro</title>
</head>
<body data-page="research">
  <header id="site-header" class="site-header"></header>

  <main>
    <section class="page-section container">
      <h2>Research interests</h2>
      <p style="max-width: 70ch;">
        My research interest focuses on data-driven precision livestock farming using artificial
        intelligence (AI) algorithms to advance dairy cattle management, health, and welfare. I
        develop deep learning models that integrate sensor, image, and on-farm phenotypic data for
        disease and fertility prediction. I design AI-based computer vision systems for automated
        animal tracking and activity monitoring in dairy cattle to support behavior and pen
        management. I also build cloud-based web applications for heat stress management and
        real-time data-driven decision support in commercial dairy operations.
      </p>

      <div class="focus-grid">
        <div class="card">
          <i class='bx bx-pulse' style="font-size: 1.8rem; color: var(--accent);" aria-hidden="true"></i>
          <h3>Disease &amp; fertility prediction</h3>
          <p>Deep learning models that integrate sensor, image, and on-farm phenotypic data.</p>
        </div>
        <div class="card">
          <i class='bx bx-camera' style="font-size: 1.8rem; color: var(--accent);" aria-hidden="true"></i>
          <h3>Computer vision &amp; tracking</h3>
          <p>AI-based systems for automated animal tracking and activity monitoring.</p>
        </div>
        <div class="card">
          <i class='bx bx-cloud' style="font-size: 1.8rem; color: var(--accent);" aria-hidden="true"></i>
          <h3>Heat stress decision support</h3>
          <p>Cloud-based web applications for real-time, data-driven decision support on farms.</p>
        </div>
      </div>
    </section>
  </main>

  <footer id="site-footer" class="site-footer"></footer>

  <script src="partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify with the preview tool**

Reload `http://localhost:8000/research.html`.
- `preview_snapshot`: confirm "Research" is active in nav, the full research-interest paragraph
  is present, and all 3 focus cards render with icon, heading, and description.
- `preview_resize` to `tablet` (768x1024): confirm the 3 focus cards reflow to fewer columns
  without overlapping text.

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add research.html
git commit -m "Add research page with interests and focus-area cards"
```

---

## Task 8: Publications page

**Files:**
- Create: `publications.html`

- [ ] **Step 1: Write `publications.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Angelo De Castro's publications, software, and research projects.">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
  <link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2C5C82">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="style.css">
  <link href='https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css' rel='stylesheet'>
  <title>Publications - Angelo De Castro</title>
</head>
<body data-page="publications">
  <header id="site-header" class="site-header"></header>

  <main>
    <section class="page-section container">
      <h2>Software &amp; projects</h2>
      <div class="pub-group">
        <div class="card">
          <img src="assets/images/animalmotionviz.png" alt="AnimalMotionViz interface screenshot" style="max-width: 240px;">
          <h3><a href="https://github.com/uf-aiaos/AnimalMotionViz" target="_blank" rel="noopener noreferrer">AnimalMotionViz</a></h3>
          <p>An interactive software tool for tracking and visualizing animal motion patterns using computer vision.</p>
        </div>
      </div>

      <h2>Peer reviewed journal articles</h2>
      <div class="pub-group">
        <div class="pub-item">
          <span class="tag tag--journal">Journal</span>
          <p class="pub-item__title">AnimalMotionViz: an interactive software tool for tracking and visualizing animal motion patterns using computer vision</p>
          <p class="pub-item__authors">Angelo L. De Castro, Jin Wang, Jessica G. Bonney-King, Gota Morota, Emily K. Miller-Cushon, and Haipeng Yu</p>
          <p class="pub-item__venue"><a href="https://doi.org/10.3168/jdsc.2024-0706" target="_blank" rel="noopener noreferrer">JDS Communications</a>, 2025</p>
        </div>
        <div class="pub-item">
          <span class="tag tag--journal">Journal</span>
          <p class="pub-item__title">Localization and Classification of Space Objects using EfficientDet detector for Space Situational Awareness</p>
          <p class="pub-item__authors">Nouar AlDahoul, Hezerul Abdul Karim, Angelo L. De Castro, and Myles Joshua Toledo Tan</p>
          <p class="pub-item__venue"><a href="https://doi.org/10.1038/s41598-022-25859-y" target="_blank" rel="noopener noreferrer">Scientific Reports</a>, 2022</p>
        </div>
      </div>

      <h2>Peer reviewed conference proceedings</h2>
      <div class="pub-group">
        <div class="pub-item">
          <span class="tag tag--conference">Conference</span>
          <p class="pub-item__title">AnimalMotionViz: an interactive software tool for tracking and visualizing animal motion patterns using computer vision</p>
          <p class="pub-item__authors">Angelo L. De Castro, Jin Wang, Jessica G. Bonney-King, Gota Morota, Emily K. Miller-Cushon, and Haipeng Yu</p>
          <p class="pub-item__venue"><a href="https://doi.org/10.1016/j.anscip.2025.08.168" target="_blank" rel="noopener noreferrer">Proceedings, The 3rd US Conference on Precision Livestock Farming</a>, June 2&ndash;5, Lincoln, NE, 2025</p>
        </div>
        <div class="pub-item">
          <span class="tag tag--conference">Conference</span>
          <p class="pub-item__title">Development of a Detection System for Endangered Mammals in Negros Island, Philippines Using YOLOv5n</p>
          <p class="pub-item__authors">John Alfred J. Casta&ntilde;eda, Angelo L. De Castro, Michael Aaron G. Sy, Nouar AlDahoul, Myles Joshua T. Tan, and Hezerul Abdul Karim</p>
          <p class="pub-item__venue"><a href="https://doi.org/10.1007/978-981-19-8406-8_35" target="_blank" rel="noopener noreferrer">Proceedings of the 9th International Conference on Computational Science and Technology</a>, 2023</p>
        </div>
      </div>

      <h2>Preprints</h2>
      <div class="pub-group">
        <div class="pub-item">
          <span class="tag tag--preprint">Preprint</span>
          <p class="pub-item__title">Can 3D point cloud data improve automated body condition score prediction in dairy cattle?</p>
          <p class="pub-item__authors">Tang, Z., Wang, J., De Castro, A., Zhang, Y., Bastos Primo, V., Montevecchio Bernardino, A.B., Morota, G., Wang, X., Chebel, R.C., and Yu, H.</p>
          <p class="pub-item__venue"><a href="https://arxiv.org/abs/2601.22522" target="_blank" rel="noopener noreferrer">arXiv:2601.22522</a>, 2026</p>
        </div>
        <div class="pub-item">
          <span class="tag tag--preprint">Preprint</span>
          <p class="pub-item__title">Evaluating transfer learning strategies for improving dairy cattle body weight prediction in small farms using depth-image and point-cloud data</p>
          <p class="pub-item__authors">Wang, J., De Castro, A., Zhang, Y., Basolli Borsatto, L., Guo, Y., Bastos Primo, V., Montevecchio Bernardino, A.B., Morota, G., Chebel, R.C., and Yu, H.</p>
          <p class="pub-item__venue"><a href="https://arxiv.org/abs/2601.01044" target="_blank" rel="noopener noreferrer">arXiv:2601.01044</a>, 2026</p>
        </div>
      </div>
    </section>
  </main>

  <footer id="site-footer" class="site-footer"></footer>

  <script src="partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify with the preview tool**

Reload `http://localhost:8000/publications.html`.
- `preview_snapshot`: confirm "Publications" is active in nav, the Software & Projects card
  shows the AnimalMotionViz screenshot and title, and all 3 pub groups (Journal, Conference,
  Preprint) show their tag, title, authors, and venue link.
- `preview_network` filtered to `failed`: confirm the screenshot loads and there are no broken
  local links (this only checks resource loads, not the external DOI/GitHub links themselves —
  those are outside our control to verify here).

Expected: all groups render, tags show the right color per type (visually check with
`preview_inspect` on one `.tag--journal`, one `.tag--conference`, one `.tag--preprint` — each
should report a different `background-color`).

- [ ] **Step 3: Commit**

```bash
git add publications.html
git commit -m "Add publications page with grouped, tagged publication list"
```

---

## Task 9: News & Media page

**Files:**
- Create: `news.html`

- [ ] **Step 1: Write `news.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Photos from Angelo De Castro's conferences, awards, and meetings.">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
  <link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2C5C82">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="style.css">
  <link href='https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css' rel='stylesheet'>
  <title>News & Media - Angelo De Castro</title>
</head>
<body data-page="news">
  <header id="site-header" class="site-header"></header>

  <main>
    <section class="page-section container">
      <h2>News &amp; media</h2>

      <div class="gallery-grid">
        <div class="gallery-item">
          <img src="assets/images/adsa-award-ceremony.jpg" alt="Angelo De Castro holding the ADSA Purina poster competition award" loading="lazy">
          <p class="gallery-item__caption">Accepting 1st Place, PhD Division &mdash; ADSA Purina Animal Nutrition Poster Competition, 2026 ADSA Annual Meeting, Milwaukee, WI.</p>
        </div>
        <div class="gallery-item">
          <img src="assets/images/adsa-poster-presentation.jpg" alt="Angelo De Castro presenting his research poster" loading="lazy">
          <p class="gallery-item__caption">Presenting &ldquo;Utility of multi-modal integration for predicting postpartum diseases in dairy cattle with imbalanced data&rdquo; &mdash; Poster Competition Finalist.</p>
        </div>
        <div class="gallery-item">
          <img src="assets/images/adsa-with-advisor.jpg" alt="Angelo De Castro with his advisor Dr. Haipeng Yu" loading="lazy">
          <p class="gallery-item__caption">With advisor Dr. Haipeng Yu at the 2026 ADSA Annual Meeting, Milwaukee, WI.</p>
        </div>
        <div class="gallery-item">
          <img src="assets/images/adsa-award-plaque.jpg" alt="Purina Animal Nutrition Graduate Student Poster Contest award plaque" loading="lazy">
          <p class="gallery-item__caption">Award plaque &mdash; Purina Animal Nutrition Graduate Student Poster Contest, 121st ADSA Annual Meeting, 2026.</p>
        </div>
      </div>
    </section>
  </main>

  <footer id="site-footer" class="site-footer"></footer>

  <script src="partials.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify with the preview tool**

Reload `http://localhost:8000/news.html`.
- `preview_snapshot`: confirm "News & Media" is active in nav and all 4 gallery items render
  with image and caption.
- `preview_network` filtered to `failed`: confirm all 4 images load (paths match Task 2's
  renamed files exactly).
- `preview_resize` to `mobile`: confirm the gallery grid reflows to a single column.

Expected: all pass, 0 failed image requests.

- [ ] **Step 3: Commit**

```bash
git add news.html
git commit -m "Add news and media page with ADSA award photo gallery"
```

---

## Task 10: Fix manifest.json

**Files:**
- Modify: `manifest.json`

- [ ] **Step 1: Replace the entire contents of `manifest.json`**

```json
{
  "name": "Angelo De Castro - Portfolio",
  "short_name": "Angelo Portfolio",
  "description": "PhD Student in Animal Sciences at University of Florida, specializing in AI and computer vision for livestock farming.",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#FAF6EC",
  "theme_color": "#2C5C82",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "assets/favicon/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/favicon/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "categories": ["education", "academic", "research"],
  "lang": "en",
  "dir": "ltr"
}
```

Note: `start_url` was previously an absolute path (`/index-modern.html`), which resolves against
the site's domain root — but this repo is served from a project-pages subpath
(`angelodecastro.github.io/Angelo-Portfolio/`), so an absolute path was silently pointing at the
wrong URL. The relative `./index.html` fixes this and matches how the pages already reference
their own assets.

- [ ] **Step 2: Verify**

```bash
python3 -c "import json; json.load(open('manifest.json'))"
```

Expected: no output (valid JSON). Then reload any page in the preview tool and check
`preview_network` for a successful (non-404) request to `manifest.json` and both icon files.

- [ ] **Step 3: Commit**

```bash
git add manifest.json
git commit -m "Fix manifest.json icon paths and start_url subpath bug"
```

---

## Task 11: Delete dead files

**Files:**
- Delete: `index-modern.html`, `index-backup.html`, `script-backup.js`, `style-backup.css`, `script-modern.js`, `style-modern.css`, `sw.js`

- [ ] **Step 1: Remove the files**

```bash
git rm index-modern.html index-backup.html script-backup.js style-backup.css script-modern.js style-modern.css sw.js
```

`sw.js` (service worker) is removed alongside the other dead files: it registered against the
old single-page site, isn't referenced by any of the new pages (none of them call
`navigator.serviceWorker.register`), and offline caching was never a stated goal for this
redesign.

- [ ] **Step 2: Verify nothing references the deleted files**

```bash
grep -rl "index-modern\|index-backup\|script-backup\|style-backup\|script-modern\|style-modern\|sw.js" --include="*.html" --include="*.js" --include="*.json" .
```

Expected: no output (no remaining references in any page, script, or `manifest.json`).

- [ ] **Step 3: Commit**

```bash
git commit -m "Remove dead file variants from earlier redesign attempts and unused service worker"
```

---

## Task 12: Full cross-page verification pass

**Files:** none (verification only)

- [ ] **Step 1: Desktop pass**

For each of `index.html`, `research.html`, `education.html`, `publications.html`, `news.html`:
`preview_screenshot` at the default desktop size. Confirm: cream background, light-blue cards,
serif headings, correct page highlighted in nav, footer with CV/email buttons and social icons
present on every page.

- [ ] **Step 2: Tablet pass**

`preview_resize` to `tablet` (768x1024) and re-screenshot each page. Confirm no horizontal
scrollbar, no overlapping text, nav still usable (hamburger active below 768px per the CSS
breakpoint).

- [ ] **Step 3: Mobile pass**

`preview_resize` to `mobile` (375x812) and re-screenshot each page. Confirm hero stacks
vertically on Home, gallery goes to a single column on News & Media, nav hamburger opens/closes
correctly (`preview_click` on `#nav-toggle`, then `preview_snapshot` to confirm links are
visible, click again to confirm they hide).

- [ ] **Step 4: Console and network check**

On each page: `preview_console_logs` with `level: "error"` and `preview_network` with
`filter: "failed"`. Expected: empty on both, for all 5 pages.

- [ ] **Step 5: Stop the preview server**

Use `mcp__Claude_Preview__preview_stop` on the server started in Task 1.

- [ ] **Step 6: Final review commit**

```bash
git log --oneline redesign-2026 ^main
git status
```

Expected: a clean working tree and a commit history showing each task's commit, all on
`redesign-2026`, none of it pushed to `origin` yet (confirm with `git status` showing
`Your branch is ahead of 'origin/main' by N commits` only after a future merge — right now the
branch simply hasn't been pushed at all).

No commit needed for this task — it's the final review checkpoint before asking the user for
sign-off to merge `redesign-2026` into `main` and push.
