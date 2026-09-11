// Admin dashboard: reads/writes data/works.json directly to GitHub via the Contents API.
// The token is stored ONLY in this browser's localStorage, never sent anywhere but api.github.com.

const GH_KEY = '7vn_admin_gh_config';
const WORKS_PATH = 'data/works.json';
const CONFIG_PATH = 'data/config.json';

let ghConfig = null;   // { owner, repo, branch, token }
let worksCache = [];   // current works.json content
let worksSha = null;   // current file sha (needed to update)
let categories = [];   // from config.json
let editingId = null;  // id of the work currently being edited, or null when adding new

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

  // Already a proper embed URL, leave it alone.
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

  // Unrecognized format, return as-is; the site will try it directly.
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

function categoryIndices(category) {
  const out = [];
  worksCache.forEach((w, i) => { if (w.category === category) out.push(i); });
  return out;
}

function renderWorksTable() {
  const body = document.getElementById('worksTableBody');
  if (worksCache.length === 0) {
    body.innerHTML = `<tr><td colspan="4" style="color:var(--muted);">No works yet.</td></tr>`;
    return;
  }
  body.innerHTML = worksCache.map((w) => {
    const indices = categoryIndices(w.category);
    const posInCategory = indices.indexOf(worksCache.indexOf(w));
    const isFirst = posInCategory === 0;
    const isLast = posInCategory === indices.length - 1;
    return `
    <tr>
      <td>
        <button class="btn btn-outline btn-small" data-move="up" data-id="${w.id}" ${isFirst ? 'disabled' : ''} aria-label="Move up">&uarr;</button>
        <button class="btn btn-outline btn-small" data-move="down" data-id="${w.id}" ${isLast ? 'disabled' : ''} aria-label="Move down">&darr;</button>
      </td>
      <td>${w.category}</td>
      <td>${w.title}</td>
      <td>
        <button class="btn btn-outline btn-small" data-edit="${w.id}">Edit</button>
        <button class="btn btn-outline btn-small btn-danger" data-delete="${w.id}">Delete</button>
      </td>
    </tr>
  `;
  }).join('');

  body.querySelectorAll('button[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteWork(btn.getAttribute('data-delete')));
  });
  body.querySelectorAll('button[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => startEdit(btn.getAttribute('data-edit')));
  });
  body.querySelectorAll('button[data-move]').forEach(btn => {
    btn.addEventListener('click', () => moveWork(btn.getAttribute('data-id'), btn.getAttribute('data-move')));
  });
}

async function moveWork(id, direction) {
  const tableStatus = document.getElementById('tableStatus');
  const work = worksCache.find(w => w.id === id);
  if (!work) return;

  const indices = categoryIndices(work.category);
  const pos = indices.indexOf(worksCache.indexOf(work));
  const swapPos = direction === 'up' ? pos - 1 : pos + 1;
  if (swapPos < 0 || swapPos >= indices.length) return;

  const i = indices[pos];
  const j = indices[swapPos];
  [worksCache[i], worksCache[j]] = [worksCache[j], worksCache[i]];

  setStatus(tableStatus, 'Reordering…', '');
  try {
    const result = await ghPutFile(WORKS_PATH, worksCache, worksSha, `Reorder works via admin`);
    worksSha = result.content.sha;
    renderWorksTable();
    setStatus(tableStatus, 'Order updated and published. Live site updates in about a minute.', 'success');
  } catch (e) {
    setStatus(tableStatus, e.message, 'error');
  }
}

async function deleteWork(id) {
  const tableStatus = document.getElementById('tableStatus');
  if (!confirm('Delete this piece? This publishes immediately.')) return;
  setStatus(tableStatus, 'Deleting…', '');
  try {
    worksCache = worksCache.filter(w => w.id !== id);
    const result = await ghPutFile(WORKS_PATH, worksCache, worksSha, `Remove work ${id} via admin`);
    worksSha = result.content.sha;
    if (editingId === id) cancelEdit();
    renderWorksTable();
    setStatus(tableStatus, 'Deleted and published. Live site updates in about a minute.', 'success');
  } catch (e) {
    setStatus(tableStatus, e.message, 'error');
  }
}

function startEdit(id) {
  const work = worksCache.find(w => w.id === id);
  if (!work) return;
  editingId = id;

  document.getElementById('newCategory').value = work.category;
  document.getElementById('newTitle').value = work.title;
  document.getElementById('newVideoUrl').value = work.videoUrl;
  document.getElementById('newThumbnail').value = work.thumbnail || '';
  document.getElementById('newDescription').value = work.description || '';

  document.getElementById('formHeading').textContent = `Editing: ${work.title}`;
  document.getElementById('addWorkBtn').textContent = 'Save changes';
  document.getElementById('cancelEditBtn').style.display = 'inline-flex';

  document.getElementById('formHeading').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEdit() {
  editingId = null;
  document.getElementById('newTitle').value = '';
  document.getElementById('newVideoUrl').value = '';
  document.getElementById('newThumbnail').value = '';
  document.getElementById('newDescription').value = '';
  document.getElementById('formHeading').textContent = 'Add a new piece';
  document.getElementById('addWorkBtn').textContent = 'Add & publish';
  document.getElementById('cancelEditBtn').style.display = 'none';
  setStatus(document.getElementById('addStatus'), '', '');
}

async function saveWork() {
  const addStatus = document.getElementById('addStatus');
  const category = document.getElementById('newCategory').value;
  const title = document.getElementById('newTitle').value.trim();
  const rawVideoUrl = document.getElementById('newVideoUrl').value.trim();
  const thumbnail = document.getElementById('newThumbnail').value.trim();
  const description = document.getElementById('newDescription').value.trim();

  if (!title || !rawVideoUrl) {
    setStatus(addStatus, 'Title and video URL are required.', 'error');
    return;
  }

  const videoUrl = normalizeVideoUrl(rawVideoUrl);
  const isEditing = !!editingId;

  setStatus(addStatus, isEditing ? 'Saving changes…' : 'Publishing…', '');
  try {
    if (isEditing) {
      const idx = worksCache.findIndex(w => w.id === editingId);
      if (idx === -1) throw new Error('Could not find that work anymore. It may have been deleted elsewhere.');
      worksCache[idx] = { ...worksCache[idx], category, title, videoUrl, thumbnail, description };
    } else {
      const id = `${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      worksCache = [...worksCache, { id, category, title, videoUrl, thumbnail, description }];
    }

    const result = await ghPutFile(WORKS_PATH, worksCache, worksSha, isEditing ? `Edit work "${title}" via admin` : `Add work "${title}" via admin`);
    worksSha = result.content.sha;
    renderWorksTable();
    cancelEdit();
    setStatus(addStatus, isEditing ? 'Changes saved and published. Live site updates in about a minute.' : 'Published! Live site updates in about a minute.', 'success');
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

  document.getElementById('addWorkBtn').addEventListener('click', saveWork);
  document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);

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
      setStatus(document.getElementById('setupStatus'), 'Saved connection failed. Please reconnect. ' + e.message, 'error');
    }
  }
});
