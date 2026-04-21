# 🖼️ Image Harvester

Paste a list of image URLs, download them all as a ZIP. Simple, fast, self-hostable.

**Auto-publishes to GitHub Container Registry (ghcr.io) on every push to `main` — no secrets or tokens needed.**

---

## 🚀 Quick Start (Docker)


```bash
docker run -p 3000:3000 ghcr.io/samstreets/image-harvester:latest
```

Then open [http://localhost:3000](http://localhost:3000)

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
