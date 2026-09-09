// Admin dashboard: reads/writes data/works.json directly to GitHub via the Contents API.
// The token is stored ONLY in this browser's localStorage — never sent anywhere but api.github.com.

const GH_KEY = '7vn_admin_gh_config';
const WORKS_PATH = 'data/works.json';
const CONFIG_PATH = 'data/config.json';

let ghConfig = null;   // { owner, repo, branch, token }
let worksCache = [];   // current works.json content
let worksSha = null;   // current file sha (needed to update)
let categories = [];   // from config.json

function b64EncodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(escape(atob(str)));
}

function ghHeaders() {
  return {
    'Authorization': `Bearer ${ghConfig.token}`,
    'Accept': 'application/vnd.github+json',
  };
}

function ghUrl(path) {
  return `https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${path}?ref=${ghConfig.branch}`;
}

async function ghGetFile(path) {
  const res = await fetch(ghUrl(path), { headers: ghHeaders() });
  if (!res.ok) throw new Error(`Could not read ${path} (${res.status}). Check repo name, branch and token permissions.`);
  const data = await res.json();
  const content = JSON.parse(b64DecodeUnicode(data.content));
  return { content, sha: data.sha };
}

async function ghPutFile(path, content, sha, message) {
  const body = {
    message,
    content: b64EncodeUnicode(JSON.stringify(content, null, 2)),
    sha,
    branch: ghConfig.branch,
  };
  const res = await fetch(`https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${path}`, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to save ${path} (${res.status})`);
  }
  return res.json();
}

function normalizeVideoUrl(raw) {
  const url = raw.trim();

  // Already a proper embed URL — leave it alone.
  if (/youtube\.com\/embed\//.test(url) || /player\.vimeo\.com\/video\//.test(url)) {
    return url;
  }

  // YouTube: watch?v=, youtu.be/, m.youtube.com, shorts/
  let m = url.match(/(?:youtube\.com|m\.youtube\.com)\/watch\?v=([a-zA-Z0-9_-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;

  m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;

  m = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;

  // Vimeo: vimeo.com/123456789
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;

  // Unrecognized format — return as-is; the site will try it directly.
  return url;
}

function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'status-msg' + (type ? ' ' + type : '');
}

async function connect(owner, repo, branch, token) {
  ghConfig = { owner, repo, branch: branch || 'main', token };
  const { content: works, sha } = await ghGetFile(WORKS_PATH);
  worksCache = works;
  worksSha = sha;
  const { content: config } = await ghGetFile(CONFIG_PATH);
  categories = config.categories || [];
  localStorage.setItem(GH_KEY, JSON.stringify(ghConfig));
}

function renderCategoryOptions() {
  const sel = document.getElementById('newCategory');
  sel.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

function renderWorksTable() {
  const body = document.getElementById('worksTableBody');
  if (worksCache.length === 0) {
    body.innerHTML = `<tr><td colspan="3" style="color:var(--muted);">No works yet.</td></tr>`;
    return;
  }
  body.innerHTML = worksCache.map(w => `
    <tr>
      <td>${w.category}</td>
      <td>${w.title}</td>
      <td><button class="btn btn-outline btn-small btn-danger" data-id="${w.id}">Delete</button></td>
    </tr>
  `).join('');

  body.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', () => deleteWork(btn.getAttribute('data-id')));
  });
}

async function deleteWork(id) {
  const tableStatus = document.getElementById('tableStatus');
  if (!confirm('Delete this piece? This publishes immediately.')) return;
  setStatus(tableStatus, 'Deleting…', '');
  try {
    worksCache = worksCache.filter(w => w.id !== id);
    const result = await ghPutFile(WORKS_PATH, worksCache, worksSha, `Remove work ${id} via admin`);
    worksSha = result.content.sha;
    renderWorksTable();
    setStatus(tableStatus, 'Deleted and published. Live site updates in about a minute.', 'success');
  } catch (e) {
    setStatus(tableStatus, e.message, 'error');
  }
}

async function addWork() {
  const addStatus = document.getElementById('addStatus');
  const category = document.getElementById('newCategory').value;
  const title = document.getElementById('newTitle').value.trim();
  const rawVideoUrl = document.getElementById('newVideoUrl').value.trim();
  const description = document.getElementById('newDescription').value.trim();

  if (!title || !rawVideoUrl) {
    setStatus(addStatus, 'Title and video URL are required.', 'error');
    return;
  }

  const videoUrl = normalizeVideoUrl(rawVideoUrl);
  const id = `${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  const newWork = { id, category, title, videoUrl, thumbnail: '', description };

  setStatus(addStatus, 'Publishing…', '');
  try {
    worksCache = [...worksCache, newWork];
    const result = await ghPutFile(WORKS_PATH, worksCache, worksSha, `Add work "${title}" via admin`);
    worksSha = result.content.sha;
    renderWorksTable();
    document.getElementById('newTitle').value = '';
    document.getElementById('newVideoUrl').value = '';
    document.getElementById('newDescription').value = '';
    setStatus(addStatus, 'Published! Live site updates in about a minute.', 'success');
  } catch (e) {
    setStatus(addStatus, e.message, 'error');
  }
}

function showDashboard() {
  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
  renderCategoryOptions();
  renderWorksTable();
}

function showSetup() {
  document.getElementById('setupScreen').style.display = 'block';
  document.getElementById('adminDashboard').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('connectBtn').addEventListener('click', async () => {
    const owner = document.getElementById('ghOwner').value.trim();
    const repo = document.getElementById('ghRepo').value.trim();
    const branch = document.getElementById('ghBranch').value.trim();
    const token = document.getElementById('ghToken').value.trim();
    const setupStatus = document.getElementById('setupStatus');

    if (!owner || !repo || !token) {
      setStatus(setupStatus, 'Fill in username, repo and token.', 'error');
      return;
    }
    setStatus(setupStatus, 'Connecting…', '');
    try {
      await connect(owner, repo, branch, token);
      showDashboard();
    } catch (e) {
      setStatus(setupStatus, e.message, 'error');
    }
  });

  document.getElementById('addWorkBtn').addEventListener('click', addWork);

  document.getElementById('disconnectBtn').addEventListener('click', () => {
    localStorage.removeItem(GH_KEY);
    ghConfig = null;
    showSetup();
  });

  // Auto-connect if a saved config exists
  const saved = localStorage.getItem(GH_KEY);
  if (saved) {
    try {
      const cfg = JSON.parse(saved);
      document.getElementById('setupStatus').textContent = 'Reconnecting…';
      await connect(cfg.owner, cfg.repo, cfg.branch, cfg.token);
      showDashboard();
    } catch (e) {
      showSetup();
      setStatus(document.getElementById('setupStatus'), 'Saved connection failed — please reconnect. ' + e.message, 'error');
    }
  }
});
