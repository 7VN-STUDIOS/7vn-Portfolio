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
  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/PLACEHOLDER', icon: 'M12 2.2c2.7 0 3 0 4.1.06 1 .05 1.6.2 2 .34.5.2.86.42 1.24.8.38.38.6.74.8 1.24.14.4.29 1 .34 2 .06 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1-.2 1.6-.34 2-.2.5-.42.86-.8 1.24-.38.38-.74.6-1.24.8-.4.14-1 .29-2 .34-1.1.06-1.4.06-4.1.06s-3 0-4.1-.06c-1-.05-1.6-.2-2-.34-.5-.2-.86-.42-1.24-.8-.38-.38-.6-.74-.8-1.24-.14-.4-.29-1-.34-2C2.2 15 2.2 14.7 2.2 12s0-3 .06-4.1c.05-1 .2-1.6.34-2 .2-.5.42-.86.8-1.24.38-.38.74-.6 1.24-.8.4-.14 1-.29 2-.34C7.9 2.2 8.2 2.2 12 2.2zm0 1.8c-2.66 0-2.97 0-4.02.06-.86.04-1.32.18-1.63.3-.41.16-.7.35-1 .65-.3.3-.49.59-.65 1-.12.31-.26.77-.3 1.63C4.34 8.03 4.32 8.34 4.34 11v2c0 2.66 0 2.97.06 4.02.04.86.18 1.32.3 1.63.16.41.35.7.65 1 .3.3.59.49 1 .65.31.12.77.26 1.63.3 1.05.06 1.36.06 4.02.06s2.97 0 4.02-.06c.86-.04 1.32-.18 1.63-.3.41-.16.7-.35 1-.65.3-.3.49-.59.65-1 .12-.31.26-.77.3-1.63.06-1.05.06-1.36.06-4.02s0-2.97-.06-4.02c-.04-.86-.18-1.32-.3-1.63-.16-.41-.35-.7-.65-1-.3-.3-.59-.49-1-.65-.31-.12-.77-.26-1.63-.3C14.97 4 14.66 4 12 4zm0 3.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8zm0 1.8a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2zm4.6-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z' },
    { name: 'WhatsApp', href: 'https://wa.me/234PLACEHOLDER', icon: 'M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.4 1.26 4.83L2 22l5.35-1.28a9.9 9.9 0 0 0 4.69 1.2h.01c5.5 0 9.95-4.46 9.95-9.96 0-2.66-1.03-5.16-2.9-7.03A9.9 9.9 0 0 0 12.04 2zm0 1.8a8.13 8.13 0 0 1 5.77 2.4 8.1 8.1 0 0 1 2.38 5.76c0 4.5-3.66 8.16-8.16 8.16a8.16 8.16 0 0 1-4.15-1.13l-.3-.18-3.17.76.76-3.09-.2-.32a8.1 8.1 0 0 1-1.24-4.34c0-4.5 3.66-8.16 8.16-8.16zm-3.47 4.4c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.2.87 2.35 1 2.5.12.17 1.7 2.72 4.2 3.71 2.07.83 2.5.66 2.95.62.45-.04 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.17-.28.19-.52.06-.24-.12-1-.37-1.92-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.02-.37.1-.5.11-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.35-.77-1.84-.2-.48-.4-.42-.55-.42h-.47z' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/PLACEHOLDER', icon: 'M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.2 8.75h3.5V21h-3.5V8.75zm6.2 0h3.36v1.68h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.34V21h-3.5v-5.5c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88V21h-3.47V8.75z' },
    { name: 'TikTok', href: 'https://tiktok.com/@PLACEHOLDER', icon: 'M14.5 2h2.9c.18 1.7 1.1 3.2 2.6 4.02V9c-1.57.05-3.02-.44-4.2-1.32v6.6c0 3.15-2.55 5.7-5.7 5.7A5.7 5.7 0 0 1 4.4 14.28a5.7 5.7 0 0 1 7.62-5.37v3.1a2.6 2.6 0 1 0 1.78 2.47V2z' },
    { name: 'Email', href: 'mailto:hello@7vnstudios.placeholder', icon: 'M2.5 5.5h19v13h-19v-13zm1.8 1.6v.3l8.7 6.1 8.7-6.1v-.3H4.3zm17.4 2.2-8.2 5.75a.9.9 0 0 1-1 0L4.3 9.3v8.4h17.4V9.3z' },
  ];

  const iconsHtml = socialLinks.map(s => `
    <a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.name}" class="social-icon">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="${s.icon}"/></svg>
    </a>
  `).join('');

  document.getElementById('site-footer').innerHTML = `
    <div class="wrap site-footer">
      <div class="footer-brand">
        <img src="assets/logo.png" alt="7VN Studios">
        <span>&copy; ${new Date().getFullYear()} 7VN Studios. All rights reserved.</span>
      </div>
      <div class="footer-links">
        <a href="contact.html">Get in touch</a>
        <div class="social-icons">${iconsHtml}</div>
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
