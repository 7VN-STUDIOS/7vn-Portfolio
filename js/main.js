// Shared header/footer + data helpers for every page

function renderHeader(active) {
  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'services.html', label: 'Services' },
    { href: 'contact.html', label: 'Contact' },
  ];
  const nav = links.map(l =>
    `<li><a href="${l.href}" class="${active === l.href ? 'active' : ''}">${l.label}</a></li>`
  ).join('');

  document.getElementById('site-header').innerHTML = `
    <div class="wrap">
      <a href="index.html" class="brand"><img src="assets/logo.png" alt="7VN Studios"></a>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
      <ul class="nav-links" id="navLinks">${nav}</ul>
    </div>
  `;

  const toggle = document.getElementById('navToggle');
  const navEl = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const isOpen = navEl.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <div class="wrap site-footer">
      <img src="assets/logo.png" alt="7VN Studios">
      <span>&copy; ${new Date().getFullYear()} 7VN Studios. All rights reserved.</span>
      <div class="footer-links">
        <a href="contact.html">Get in touch</a>
      </div>
    </div>
  `;
}

async function loadJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

function toEmbed(url) {
  // Best-effort: pass through if already an embed URL, else return as-is for iframe src.
  return url;
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.getAttribute('data-page') || '';
  renderHeader(page);
  renderFooter();
});
