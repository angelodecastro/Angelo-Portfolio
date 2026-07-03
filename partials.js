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
