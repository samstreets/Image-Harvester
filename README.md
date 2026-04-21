# 🖼️ Image Harvester

Paste a list of image URLs, download them all as a ZIP. Simple, fast, self-hostable.

**Auto-publishes to GitHub Container Registry (ghcr.io) on every push to `main` — no secrets or tokens needed.**

---

## 🚀 Quick Start (Docker)

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your own:

```bash
docker run -p 3000:3000 ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME:latest
```

Then open [http://localhost:3000](http://localhost:3000)

> **Find your image URL** after the first push under your repo's **Packages** tab on GitHub,  
> or at `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/pkgs/container/YOUR_REPO_NAME`

---

## 🛠️ Setup GitHub → GHCR Auto-Deploy

This repo uses **GitHub Container Registry (ghcr.io)** — GitHub's own built-in container registry. Unlike Docker Hub, **no account, tokens, or secrets are required**. Everything is handled automatically by the built-in `GITHUB_TOKEN`.

### 1. Push this repo to GitHub

```bash
git init && git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
git push -u origin main
```

### 2. That's it — no secrets needed!

The workflow uses `secrets.GITHUB_TOKEN`, which GitHub provides automatically to every repo. No setup required.

Every push to `main` will:
- Build a multi-platform image (`linux/amd64` + `linux/arm64`)
- Tag it `:latest` + `:sha-<commit>`
- Push to `ghcr.io/YOUR_USERNAME/YOUR_REPO_NAME`

On a GitHub Release it also tags with the semver version (e.g. `1.2.3`).

### 3. (Optional) Make the package public

By default the image is private. To make it publicly pullable:

1. Go to your repo on GitHub → **Packages** (right sidebar)
2. Click the `image-harvester` package → **Package settings**
3. Scroll to **Danger Zone** → **Change visibility** → Public

---

## 🧑‍💻 Local Development

```bash
npm install
npm run dev        # uses nodemon for hot-reload
```

Or with Docker Compose:

```bash
docker compose up --build
```

---

## 📡 API

### `POST /api/download`
Downloads all valid image URLs and streams back a ZIP.

```json
{ "urls": ["https://example.com/a.jpg", "https://example.com/b.png"] }
```

Returns: `application/zip`

### `POST /api/preview`
Checks up to 20 URLs and reports which are valid images (HEAD request).

```json
{ "urls": ["https://example.com/a.jpg"] }
```

Returns:
```json
[{ "url": "...", "valid": true, "contentType": "image/jpeg" }]
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port to listen on |
