# 7VN Studios — Portfolio Website

Plain HTML/CSS/JS. No build step, no paid services required.

## 1. Put it on GitHub

1. Go to github.com → New repository → name it (e.g. `7vn-portfolio`) → Public or Private, either works.
2. Upload every file in this folder to that repo (drag-and-drop on the GitHub website works, or use `git push` if you're comfortable with git).

## 2. Deploy for free on Netlify

1. Go to netlify.com → sign in with GitHub (free).
2. "Add new site" → "Import an existing project" → pick your `7vn-portfolio` repo.
3. Build command: leave blank. Publish directory: `.` (a single dot).
4. Deploy. Netlify gives you a free URL like `7vn-studios.netlify.app` immediately — no domain purchase needed.
5. Any time you push a change to GitHub (including from the admin page), Netlify rebuilds automatically within about a minute.

## 3. Set up the admin page

The admin page (`yoursite.netlify.app/admin.html`) lets you add or remove videos without touching code. It saves directly to your GitHub repo using a personal access token.

**Create the token (one-time):**
1. On GitHub: click your profile photo → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
2. Give it a name like "7VN Admin".
3. Under "Repository access," choose "Only select repositories" and pick your `7vn-portfolio` repo.
4. Under "Permissions" → "Repository permissions" → set **Contents** to **Read and write**. Leave everything else as-is.
5. Generate the token and copy it (starts with `github_pat_...`). You won't see it again after leaving the page — if you lose it, just generate a new one.

**Connect the admin page:**
1. Open `admin.html` on your live site.
2. Enter your GitHub username, the repo name (`7vn-portfolio`), branch (`main`), and paste the token.
3. Click Connect. The token is saved only in your browser (localStorage) — it isn't sent anywhere except GitHub's API.
4. From here, fill in the "Add a new piece" form (category, title, video embed URL, description) and click "Add & publish." It commits straight to `data/works.json` and your live site updates automatically.

**Where to get a "video embed URL":**
- YouTube: open the video → Share → Embed → copy the URL inside `src="..."` (looks like `https://www.youtube.com/embed/VIDEO_ID`).
- Vimeo: Share → Embed → same idea (looks like `https://player.vimeo.com/video/VIDEO_ID`).

## 4. Things to replace before launch

- `data/config.json` — swap the placeholder Google Drive links (one per category), WhatsApp link, email, and service pricing.
- `data/works.json` — currently has 2 placeholder pieces per category; replace with real ones via the admin page, or edit the file directly on GitHub.
- `assets/logo.png` — already your uploaded logo.

## 5. Add a real domain later

When you're ready to buy a domain: Netlify → Site settings → Domain management → Add a domain. Netlify walks you through pointing DNS at it. No code changes needed.

